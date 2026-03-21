import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useBalance } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import { sepolia } from 'wagmi/chains'

// Hook: Get ETH Price
export function useETHPrice() {
  return useReadContract({
    address: '0x694AA1769357215DE4FAC081bf1f309aDC325306' as `0x${string}`,
    abi: [
      {
        inputs: [],
        name: 'latestRoundData',
        outputs: [
          { name: 'roundId', type: 'uint80' },
          { name: 'answer', type: 'int256' },
          { name: 'startedAt', type: 'uint256' },
          { name: 'updatedAt', type: 'uint256' },
          { name: 'answeredInRound', type: 'uint80' },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'latestRoundData',
    chainId: sepolia.id,
  })
}

// Hook: Get Wallet Balance
export function useWalletBalance() {
  const { address } = useAccount()
  return useBalance({
    address,
    chainId: sepolia.id,
  })
}

// Hook: Get Event Data from Contract
export function useEvent(eventId: bigint) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getEvent',
    args: [eventId],
    chainId: sepolia.id,
  })
}

// Hook: Get Event Count
export function useEventCount() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'eventCount',
    chainId: sepolia.id,
  })
}

// Hook: Get Tickets by Owner
export function useMyTickets() {
  const { address } = useAccount()
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getTicketsByOwner',
    args: [address as `0x${string}`],
    enabled: !!address,
    chainId: sepolia.id,
  })
}

// Hook: Get Single Ticket
export function useTicket(tokenId: bigint) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getTicket',
    args: [tokenId],
    chainId: sepolia.id,
  })
}

// Hook: Mint Ticket
export function useMintTicket() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const mint = async (eventId: bigint, tier: string, tokenURI: string, price: string) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'mintTicket',
      args: [eventId, tier, tokenURI],
      value: parseEther(price),
      chainId: sepolia.id,
    })
  }

  return { mint, hash, isPending, isConfirming, isSuccess, error }
}

// Hook: Use Ticket (at gate)
export function useUseTicket() {
  const { writeContract, data: hash, isPending } = useWriteContract()

  const { isSuccess } = useWaitForTransactionReceipt({ hash })

  const useTicketFn = (tokenId: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'useTicket',
      args: [tokenId],
      chainId: sepolia.id,
    })
  }

  return { useTicketFn, hash, isPending, isSuccess }
}

// Hook: Create Event
export function useCreateEvent() {
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isSuccess } = useWaitForTransactionReceipt({ hash })

  const createEvent = (
    name: string,
    date: string,
    venue: string,
    price: string,
    maxSupply: bigint,
    royalty: bigint
  ) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'createEvent',
      args: [name, date, venue, parseEther(price), maxSupply, royalty],
      chainId: sepolia.id,
    })
  }

  return { createEvent, hash, isPending, isSuccess }
}

// Helpers
export function formatETH(wei: bigint): string {
  return parseFloat(formatEther(wei)).toFixed(4)
}

export function ethToUSD(eth: number, ethPrice: number): string {
  return (eth * ethPrice).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}
