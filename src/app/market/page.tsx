'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { sepolia } from 'wagmi/chains'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'

interface Listing {
    tokenId: string
    seller: string
    price: string
    eventName: string
    tier: string
    emoji: string
}

// Hook: List ticket for sale
function useListTicket() {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isSuccess } = useWaitForTransactionReceipt({ hash })

    const listTicket = (tokenId: bigint, price: string) => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: [
                {
                    name: 'approve',
                    type: 'function',
                    stateMutability: 'nonpayable',
                    inputs: [
                        { name: 'to', type: 'address' },
                        { name: 'tokenId', type: 'uint256' },
                    ],
                    outputs: [],
                },
            ] as const,
            functionName: 'approve',
            args: [CONTRACT_ADDRESS, tokenId],
            chainId: sepolia.id,
        })
    }

    return { listTicket, hash, isPending, isSuccess }
}

// Hook: Buy ticket
function useBuyTicket() {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isSuccess } = useWaitForTransactionReceipt({ hash })

    const buyTicket = (tokenId: bigint, price: string) => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'mintTicket',
            args: [BigInt(1), 'Secondary', 'ipfs://secondary'],
            value: parseEther(price),
            chainId: sepolia.id,
        })
    }

    return { buyTicket, hash, isPending, isSuccess }
}

export default function MarketPage() {
    const { address, isConnected } = useAccount()
    const [listingModal, setListingModal] = useState(false)
    const [buyModal, setBuyModal] = useState<Listing | null>(null)
    const [listPrice, setListPrice] = useState('')
    const [listTokenId, setListTokenId] = useState('')
    const [toast, setToast] = useState('')
    const { listTicket, isPending: isListing, isSuccess: isListed } = useListTicket()
    const { buyTicket, isPending: isBuying, isSuccess: isBought } = useBuyTicket()

    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(''), 3000)
    }

    // Mock listings — in production fetch from contract events
    const listings: Listing[] = [
        { tokenId: '1', seller: '0x3f2A...9B4c', price: '0.055', eventName: 'Electronic Horizon Festival', tier: 'General Admission', emoji: '🎵' },
        { tokenId: '2', seller: '0x7A1D...2E5f', price: '0.095', eventName: 'Neon City Rave Vol. 3', tier: 'VIP Pass', emoji: '🎤' },
        { tokenId: '3', seller: '0x9C3B...4A1d', price: '0.012', eventName: 'Block Summit 2026', tier: 'General Admission', emoji: '💻' },
        { tokenId: '4', seller: '0x1E8F...7C2a', price: '0.035', eventName: 'Metamorphosis Art Fair', tier: 'General Admission', emoji: '🎨' },
    ]

    return (
        <main style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', background: '#FAFAFF', minHeight: '100vh', color: '#0F0A1E' }}>

            {/* NAVBAR */}
            <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0 48px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #E8E4F5' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '20px', color: '#0F0A1E', textDecoration: 'none' }}>
                    <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🎟️</div>
                    Ticket<span style={{ color: '#7C3AED' }}>Pro</span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                    <Link href="/" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Home</Link>
                    <Link href="/events" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Explore</Link>
                    <Link href="/market" style={{ fontSize: '14px', fontWeight: 700, color: '#7C3AED', textDecoration: 'none' }}>Market</Link>
                    <Link href="/dashboard" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Dashboard</Link>
                </div>
                <ConnectButton />
            </nav>

            {/* HEADER */}
            <div style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7,#EC4899)', padding: '48px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.12) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
                <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h1 style={{ fontSize: '40px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>🛒 Secondary Market</h1>
                        <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)' }}>Buy and sell NFT tickets peer-to-peer on the blockchain</p>
                    </div>
                    {isConnected && (
                        <button onClick={() => setListingModal(true)}
                            style={{ background: 'white', color: '#7C3AED', border: 'none', borderRadius: '50px', padding: '14px 28px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                            💸 List My Ticket
                        </button>
                    )}
                </div>
            </div>

            {/* STATS */}
            <div style={{ background: 'white', borderBottom: '1px solid #E8E4F5', padding: '20px 48px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px' }}>
                    {[
                        { icon: '🏷️', num: `${listings.length}`, label: 'Active Listings' },
                        { icon: '💰', num: '0.24 ETH', label: 'Total Volume' },
                        { icon: '📊', num: '0.049 ETH', label: 'Avg Price' },
                        { icon: '🔄', num: '12', label: 'Trades Today' },
                    ].map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', background: '#F3F0FF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{s.icon}</div>
                            <div>
                                <div style={{ fontSize: '20px', fontWeight: 800 }}>{s.num}</div>
                                <div style={{ fontSize: '12px', color: '#9896B0' }}>{s.label}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* LISTINGS */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 48px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 800 }}>Active Listings</h2>
                    <span style={{ fontSize: '13px', color: '#9896B0' }}>{listings.length} listings available</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '20px' }}>
                    {listings.map((listing) => (
                        <div key={listing.tokenId} style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '20px', overflow: 'hidden', display: 'flex' }}>
                            <div style={{ width: '120px', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', flexShrink: 0 }}>
                                {listing.emoji}
                            </div>
                            <div style={{ padding: '20px', flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <div>
                                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F0A1E', marginBottom: '3px' }}>{listing.eventName}</div>
                                        <div style={{ fontSize: '12px', color: '#7C3AED', fontWeight: 600 }}>{listing.tier}</div>
                                    </div>
                                    <span style={{ background: '#F3F0FF', color: '#7C3AED', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '50px' }}>#{listing.tokenId}</span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#9896B0', marginBottom: '14px' }}>Seller: <span style={{ fontFamily: 'monospace', color: '#4B4869' }}>{listing.seller}</span></div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ fontSize: '11px', color: '#9896B0' }}>Price</div>
                                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#7C3AED' }}>{listing.price} ETH</div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (!isConnected) { showToast('🔗 Connect wallet first!'); return }
                                            if (listing.seller === address?.slice(0, 6) + '...' + address?.slice(-4)) { showToast('❌ Cannot buy your own listing!'); return }
                                            setBuyModal(listing)
                                        }}
                                        style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: 'white', border: 'none', borderRadius: '50px', padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                        Buy Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* LIST TICKET MODAL */}
            {listingModal && (
                <div onClick={() => setListingModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(15,10,30,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '24px', padding: '40px', width: '420px', boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}>
                        <div style={{ fontSize: '32px', marginBottom: '16px', textAlign: 'center' }}>💸</div>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F0A1E', marginBottom: '8px', textAlign: 'center' }}>List Ticket for Sale</div>
                        <p style={{ fontSize: '14px', color: '#9896B0', textAlign: 'center', marginBottom: '24px', lineHeight: 1.6 }}>Set your price and list your NFT ticket on the secondary market</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F0A1E', display: 'block', marginBottom: '6px' }}>Token ID</label>
                                <input value={listTokenId} onChange={e => setListTokenId(e.target.value)}
                                    placeholder="e.g. 1"
                                    style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E8E4F5', borderRadius: '12px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
                            </div>
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 700, color: '#0F0A1E', display: 'block', marginBottom: '6px' }}>Sale Price (ETH)</label>
                                <input type="number" step="0.001" value={listPrice} onChange={e => setListPrice(e.target.value)}
                                    placeholder="e.g. 0.055"
                                    style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #E8E4F5', borderRadius: '12px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
                                {listPrice && <div style={{ fontSize: '12px', color: '#9896B0', marginTop: '4px' }}>≈ ${(parseFloat(listPrice) * 3600).toFixed(2)} USD · You receive {(parseFloat(listPrice) * 0.975).toFixed(4)} ETH after 2.5% fee</div>}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setListingModal(false)}
                                style={{ flex: 1, padding: '13px', background: 'white', color: '#4B4869', border: '1.5px solid #E8E4F5', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (listTokenId && listPrice) {
                                        listTicket(BigInt(listTokenId), listPrice)
                                        setListingModal(false)
                                        showToast('✅ Listing submitted to blockchain!')
                                    }
                                }}
                                disabled={isListing}
                                style={{ flex: 2, padding: '13px', background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                {isListing ? '⏳ Processing...' : '💸 List for Sale'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* BUY MODAL */}
            {buyModal && (
                <div onClick={() => setBuyModal(null)} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(15,10,30,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '24px', padding: '40px', width: '420px', boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px', textAlign: 'center' }}>{buyModal.emoji}</div>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F0A1E', marginBottom: '4px', textAlign: 'center' }}>{buyModal.eventName}</div>
                        <div style={{ fontSize: '14px', color: '#7C3AED', fontWeight: 600, textAlign: 'center', marginBottom: '24px' }}>{buyModal.tier}</div>

                        <div style={{ background: '#FAFAFF', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
                            {[
                                { label: 'Token ID', val: `#${buyModal.tokenId}` },
                                { label: 'Seller', val: buyModal.seller },
                                { label: 'Price', val: `${buyModal.price} ETH` },
                                { label: 'Platform fee (2.5%)', val: `${(parseFloat(buyModal.price) * 0.025).toFixed(4)} ETH` },
                                { label: 'Total', val: `${(parseFloat(buyModal.price) * 1.025).toFixed(4)} ETH` },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < 4 ? '1px solid #E8E4F5' : 'none' }}>
                                    <span style={{ fontSize: '13px', color: '#9896B0' }}>{item.label}</span>
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: i === 4 ? '#7C3AED' : '#0F0A1E' }}>{item.val}</span>
                                </div>
                            ))}
                        </div>

                        {isBought ? (
                            <div style={{ textAlign: 'center', padding: '20px' }}>
                                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
                                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F0A1E' }}>Purchase Successful!</div>
                                <Link href="/dashboard" style={{ display: 'inline-block', marginTop: '16px', background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: 'white', padding: '12px 24px', borderRadius: '50px', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>View My Tickets →</Link>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={() => setBuyModal(null)}
                                    style={{ flex: 1, padding: '13px', background: 'white', color: '#4B4869', border: '1.5px solid #E8E4F5', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                    Cancel
                                </button>
                                <button onClick={() => buyTicket(BigInt(buyModal.tokenId), buyModal.price)} disabled={isBuying}
                                    style={{ flex: 2, padding: '13px', background: isBuying ? '#A855F7' : 'linear-gradient(135deg,#7C3AED,#A855F7)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: isBuying ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                                    {isBuying ? '⏳ Confirming...' : `Buy for ${buyModal.price} ETH`}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TOAST */}
            {toast && (
                <div style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 999, background: '#0F0A1E', color: 'white', padding: '14px 20px', borderRadius: '14px', fontSize: '13px', fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                    {toast}
                </div>
            )}
        </main>
    )
}