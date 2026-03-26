// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract TicketNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard, ERC2981 {

    uint256 private _tokenIdCounter;

    struct Event {
        string name;
        string date;
        string venue;
        uint256 price;
        uint256 maxSupply;
        uint256 minted;
        bool active;
        address organizer;
        uint256 royaltyPercent;
        string metadataURI;
    }

    struct Ticket {
        uint256 eventId;
        string tier;
        address originalOwner;
        bool used;
    }

    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => mapping(address => uint256)) public mintedPerWallet;

    uint256 public eventCount;
    uint256 public platformFee = 250; // 2.5%

    event EventCreated(uint256 indexed eventId, string name, address organizer);
    event TicketMinted(uint256 indexed tokenId, uint256 indexed eventId, address buyer);
    event TicketUsed(uint256 indexed tokenId);

    constructor() ERC721("TicketPro NFT", "TKPRO") Ownable(msg.sender) {}

function createEvent(
    string memory _name,
    string memory _date,
    string memory _venue,
    uint256 _price,
    uint256 _maxSupply,
    uint256 _royaltyPercent,
    string memory _metadataURI // <--- TAMBAHKAN PARAMETER KE-7
) external returns (uint256) {
    require(_royaltyPercent <= 1000, "Max royalty 10%");
    
    eventCount++;
    events[eventCount] = Event({
        name: _name,
        date: _date,
        venue: _venue,
        price: _price,
        maxSupply: _maxSupply,
        minted: 0,
        active: true,
        organizer: msg.sender,
        royaltyPercent: _royaltyPercent,
        metadataURI: _metadataURI // <--- MASUKKAN KE DALAM STRUCT
    });

    emit EventCreated(eventCount, _name, msg.sender);
    return eventCount;
}
    function mintTicket(
        uint256 _eventId,
        string memory _tier,
        string memory _tokenURI
    ) external payable nonReentrant returns (uint256) {
        Event storage ev = events[_eventId];
        
        require(ev.active, "Event not active");
        require(ev.minted < ev.maxSupply, "Sold out");
        require(msg.value >= ev.price, "Insufficient payment");
        require(mintedPerWallet[_eventId][msg.sender] < 5, "Max 5 per wallet");

        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);

        _setTokenRoyalty(tokenId, ev.organizer, uint96(ev.royaltyPercent));

        tickets[tokenId] = Ticket({
            eventId: _eventId,
            tier: _tier,
            originalOwner: msg.sender,
            used: false
        });

        ev.minted++;
        mintedPerWallet[_eventId][msg.sender]++;

        uint256 fee = (msg.value * platformFee) / 10000;
        uint256 organizerShare = msg.value - fee;

        (bool successOrg, ) = payable(ev.organizer).call{value: organizerShare}("");
        require(successOrg, "Transfer to organizer failed");

        (bool successFee, ) = payable(owner()).call{value: fee}("");
        require(successFee, "Transfer to platform failed");

        emit TicketMinted(tokenId, _eventId, msg.sender);
        return tokenId;
    }

    function useTicket(uint256 _tokenId) external {
        require(ownerOf(_tokenId) == msg.sender, "Not ticket owner");
        require(!tickets[_tokenId].used, "Already used");
        
        tickets[_tokenId].used = true;
        emit TicketUsed(_tokenId);
    }


// --- TAMBAHAN BARU: STRUCT & FUNGSI UNTUK HALAMAN MARKET ---
    
    // Struct khusus agar frontend bisa mendapatkan ID event sekaligus
    struct EventView {
        uint256 id;
        string name;
        string date;
        string venue;
        uint256 price;
        uint256 maxSupply;
        uint256 minted;
        bool active;
        address organizer;
        uint256 royaltyPercent;
        string metadataURI;
    }

    // Fungsi untuk memanggil semua event (yang dicari oleh frontend)
    function getAllEvents() external view returns (EventView[] memory) {
        uint256 total = eventCount;
        EventView[] memory result = new EventView[](total);
        
        for (uint256 i = 1; i <= total; i++) {
            Event storage ev = events[i];
            result[i - 1] = EventView({
                id: i,
                name: ev.name,
                date: ev.date,
                venue: ev.venue,
                price: ev.price,
                maxSupply: ev.maxSupply,
                minted: ev.minted,
                active: ev.active,
                organizer: ev.organizer,
                royaltyPercent: ev.royaltyPercent,
                metadataURI: ev.metadataURI
            });
        }
        return result;
    }
    // -----------------------------------------------------------


    // --- PERBAIKAN NAMA FUNGSI DI SINI ---
    // Mengubah 'getEvent' menjadi 'getEventDetails' agar tidak bentrok dengan fungsi internal ethers.js
    function getEventDetails(uint256 _eventId) external view returns (Event memory) {
        return events[_eventId];
    }

    function getTicket(uint256 _tokenId) external view returns (Ticket memory) {
        return tickets[_tokenId];
    }

    function getTicketsByOwner(address _owner) external view returns (uint256[] memory) {
        uint256 total = _tokenIdCounter;
        uint256 count = 0;
        
        for (uint256 i = 1; i <= total; i++) {
            // PERBAIKAN: Menggunakan _ownerOf sesuai standar v5.x
            if (_ownerOf(i) == _owner) {
                count++;
            }
        }
        
        uint256[] memory result = new uint256[](count);
        uint256 idx = 0;
        for (uint256 i = 1; i <= total; i++) {
            if (_ownerOf(i) == _owner) {
                result[idx] = i;
                idx++;
            }
        }
        return result;
    }

    function setPlatformFee(uint256 _fee) external onlyOwner {
        require(_fee <= 500, "Max fee 5%");
        platformFee = _fee;
    }

    function toggleEvent(uint256 _eventId) external {
        require(events[_eventId].organizer == msg.sender || owner() == msg.sender, "Not authorized");
        events[_eventId].active = !events[_eventId].active;
    }

    // Fungsi override tetap dipertahankan
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // PERBAIKAN: Fungsi internal _exists dihapus karena menyebabkan konflik penamaan di v5.x.
    // Sebagai gantinya, logika pengecekan token menggunakan _ownerOf secara langsung.
}