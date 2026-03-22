const PINATA_API_KEY = process.env.PINATA_API_KEY!
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY!
const GATEWAY = process.env.NEXT_PUBLIC_GATEWAY_URL!

// Upload JSON metadata to IPFS
export async function uploadMetadataToIPFS(metadata: object): Promise<string> {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_SECRET_KEY,
        },
        body: JSON.stringify({
            pinataContent: metadata,
            pinataMetadata: { name: 'TicketPro NFT Metadata' },
        }),
    })

    const data = await response.json()
    return `ipfs://${data.IpfsHash}`
}

// Upload image to IPFS
export async function uploadImageToIPFS(imageBuffer: Buffer, filename: string): Promise<string> {
    const formData = new FormData()
    const blob = new Blob([imageBuffer])
    formData.append('file', blob, filename)
    formData.append('pinataMetadata', JSON.stringify({ name: filename }))

    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_SECRET_KEY,
        },
        body: formData,
    })

    const data = await response.json()
    return `ipfs://${data.IpfsHash}`
}

// Convert IPFS URI to HTTP URL
export function ipfsToHttp(ipfsUri: string): string {
    if (ipfsUri.startsWith('ipfs://')) {
        return `${GATEWAY}/${ipfsUri.replace('ipfs://', '')}`
    }
    return ipfsUri
}

// Generate NFT Metadata
export function generateTicketMetadata(params: {
    eventId: number
    eventName: string
    date: string
    venue: string
    city: string
    tier: string
    tokenId: number
    ownerAddress: string
    imageUrl: string
}) {
    return {
        name: `TicketPro #${params.tokenId} — ${params.eventName}`,
        description: `Official NFT ticket for ${params.eventName}. Tier: ${params.tier}. Date: ${params.date} at ${params.venue}, ${params.city}.`,
        image: params.imageUrl,
        external_url: `https://ticketpr.vercel.app/ticket/${params.eventId}`,
        attributes: [
            { trait_type: 'Event Name', value: params.eventName },
            { trait_type: 'Event ID', value: params.eventId.toString() },
            { trait_type: 'Tier', value: params.tier },
            { trait_type: 'Date', value: params.date },
            { trait_type: 'Venue', value: params.venue },
            { trait_type: 'City', value: params.city },
            { trait_type: 'Token ID', value: params.tokenId.toString() },
            { trait_type: 'Platform', value: 'TicketPro' },
            { trait_type: 'Network', value: 'Sepolia' },
            { trait_type: 'Status', value: 'Valid' },
        ],
    }
}