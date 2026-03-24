import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useBalance } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import { sepolia } from 'wagmi/chains'

// 1. Hook untuk mengambil SEMUA Event (Penting untuk Market)
export function useEvents() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getAllEvents', // Pastikan nama fungsi di Smart Contract kamu benar
    chainId: sepolia.id,
    query: { refetchInterval: 10_000 }
  })
}

export function useETHPrice() {
  return useReadContract({
    address: '0x694AA1769357215DE4FAC081bf1f309aDC325306' as `0x${string}`,
    abi: [{ inputs: [], name: 'latestRoundData', outputs: [{ name: 'roundId', type: 'uint80' }, { name: 'answer', type: 'int256' }, { name: 'startedAt', type: 'uint256' }, { name: 'updatedAt', type: 'uint256' }, { name: 'answeredInRound', type: 'uint80' }], stateMutability: 'view', type: 'function' }],
    functionName: 'latestRoundData',
    chainId: sepolia.id,
    query: { refetchInterval: 30_000 },
  })
}

export function useWalletBalance() {
  const { address } = useAccount()
  return useBalance({ address, chainId: sepolia.id, query: { enabled: !!address, refetchInterval: 10_000 } })
}

export function useEventCount() {
  return useReadContract({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'eventCount', chainId: sepolia.id, query: { refetchInterval: 10_000 } })
}

export function useEvent(eventId: bigint) {
  return useReadContract({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'getEventDetails', args: [eventId], chainId: sepolia.id, query: { enabled: eventId >= BigInt(0) } })
}

export function useMyTickets() {
  const { address } = useAccount()
  return useReadContract({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'getTicketsByOwner', args: address ? [address as `0x${string}`] : undefined, chainId: sepolia.id, query: { enabled: !!address, refetchInterval: 10_000 } })
}

export function useTicket(tokenId: bigint) {
  return useReadContract({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'tickets', args: [tokenId], chainId: sepolia.id, query: { enabled: tokenId >= BigInt(0) } })
}

// 2. Hook Mint yang disesuaikan agar cocok dengan halaman Market
// Cari bagian useMintTicket dan ganti dengan ini:
export function useMintTicket() {
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  // Kita pakai nama 'mintTicket' agar sama dengan pemanggilan di halaman
  const mintTicket = async (eventId: bigint, price: any) => {
    console.log("Memulai Mint untuk Event ID:", eventId.toString());

    // PENGAMAN: Cek apakah harga perlu diubah ke Wei atau sudah dalam bentuk BigInt
    const priceInWei = typeof price === 'bigint' ? price : parseEther(price.toString());

    return await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'mintTicket',
      // Pastikan argumen ini [ID, Tier, URI] sama dengan di file .sol kamu!
      args: [eventId, "General", ""],
      value: priceInWei,
      chainId: sepolia.id,
    })
  }

  return { mintTicket, hash, isPending, isConfirming, isSuccess, error }
}

  return { mint, hash, isPending, isConfirming, isSuccess, error }
}

export function useUseTicket() {
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract()
  const { isSuccess } = useWaitForTransactionReceipt({ hash })
  const useTicketFn = async (tokenId: bigint) => {
    await writeContractAsync({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'useTicket', args: [tokenId], chainId: sepolia.id })
  }
  return { useTicketFn, hash, isPending, isSuccess, error }
}

export function useCreateEvent() {
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const createEvent = async (
    name: string,
    date: string,
    location: string,
    price: bigint, // Sekarang menerima BigInt langsung dari parseEther di UI
    maxSupply: bigint,
    royaltyPercent: bigint,
    metadataURI: string
  ) => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'createEvent',
      args: [name, date, location, price, maxSupply, royaltyPercent, metadataURI],
      chainId: sepolia.id
    })
  }

  return { createEvent, hash, isPending, isConfirming, isSuccess, error }
}

// Utils
export function formatETH(wei: bigint): string { return parseFloat(formatEther(wei)).toFixed(4) }
export function ethToUSD(eth: number, ethPrice: number): string { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(eth * ethPrice) }
export function shortenAddress(address: string): string { return `${address.slice(0, 6)}...${address.slice(-4)}` }
export function weiToEth(wei: bigint): number { return parseFloat(formatEther(wei)) }