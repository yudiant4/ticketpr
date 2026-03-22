export function useMintTicket() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
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
    writeContract({
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