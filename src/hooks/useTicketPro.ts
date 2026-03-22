const mint = async (
  eventId: bigint,
  tier: string,
  eventName: string,
  date: string,
  venue: string,
  city: string,
  price: string
) => {
  // Langsung pakai static URI — tidak perlu call API dulu
  // ini mencegah spam 404 di console
  const tokenURI = `https://ticketpr-six.vercel.app/api/metadata-static/${eventId}`

  const txHash = await writeContractAsync({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'mintTicket',
    args: [eventId, tier, tokenURI],
    value: parseEther(price),
    chainId: sepolia.id,
  })

  return txHash
}