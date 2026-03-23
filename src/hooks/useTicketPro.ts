import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useBalance } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import { sepolia } from 'wagmi/chains'

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
  return useReadContract({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'getEventDetails', args: [eventId], chainId: sepolia.id, query: { enabled: eventId > BigInt(0) } })
}

export function useMyTickets() {
  const { address } = useAccount()
  return useReadContract({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'getTicketsByOwner', args: address ? [address as `0x${string}`] : undefined, chainId: sepolia.id, query: { enabled: !!address, refetchInterval: 10_000 } })
}

export function useTicket(tokenId: bigint) {
  return useReadContract({ address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'getEventDetails', args: [tokenId], chainId: sepolia.id, query: { enabled: tokenId > BigInt(0) } })
}

// INI FUNGSI MINT YANG SUDAH DIPERBAIKI (Ada API Metadata + writeContractAsync)
export function useMintTicket() {
  const { writeContractAsync, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const mint = async (
    eventId: bigint,
    tier: string,
    eventName: string,
    date: string,
    venue: string,
    city: string,
    price: string
  ) => {
    // Step 1: Upload metadata to IPFS first
    const metadataRes = await fetch('/api/metadata', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: eventId.toString(),
        eventName,
        date,
        venue,
        city,
        tier,
        tokenId: Date.now(),
        ownerAddress: 'pending',
      }),
    })

    const metadataData = await metadataRes.json()

    if (!metadataData.success) {
      throw new Error('Failed to upload metadata to IPFS')
    }

    // Step 2: Mint NFT with IPFS URI
    await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'mintTicket',
      args: [eventId, tier, metadataData.ipfsUri],
      value: parseEther(price),
      chainId: sepolia.id,
    })
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
    venue: string,
    price: string,
    maxSupply: bigint,
    royaltyPercent: bigint,
    metadataURI: string 
  ) => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'createEvent',
    
      args: [
        name,
        date,
        venue,
        parseEther(price),
        maxSupply,
        royaltyPercent,
        metadataURI 
      ],
      chainId: sepolia.id
    })
  }

  return { createEvent, hash, isPending, isConfirming, isSuccess, error }
}

export function formatETH(wei: bigint): string { return parseFloat(formatEther(wei)).toFixed(4) }
export function ethToUSD(eth: number, ethPrice: number): string { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(eth * ethPrice) }
export function shortenAddress(address: string): string { return `${address.slice(0, 6)}...${address.slice(-4)}` }
export function weiToEth(wei: bigint): number { return parseFloat(formatEther(wei)) }