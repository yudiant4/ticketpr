import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { eventId, eventName, date, venue, city, tier, tokenId } = body

        const metadata = {
            name: `TicketPro #${tokenId} — ${eventName}`,
            description: `Official NFT ticket for ${eventName}. Tier: ${tier}. Date: ${date} at ${venue}, ${city}.`,
            image: `https://ticketpr-six.vercel.app/api/ticket-image/${eventId}`,
            external_url: `https://ticketpr-six.vercel.app/ticket/${eventId}`,
            attributes: [
                { trait_type: 'Event Name', value: eventName },
                { trait_type: 'Event ID', value: eventId.toString() },
                { trait_type: 'Tier', value: tier },
                { trait_type: 'Date', value: date },
                { trait_type: 'Venue', value: venue },
                { trait_type: 'City', value: city },
                { trait_type: 'Platform', value: 'TicketPro' },
                { trait_type: 'Network', value: 'Sepolia' },
            ],
        }

        // Coba upload ke Pinata kalau ada API key
        const PINATA_API_KEY = process.env.PINATA_API_KEY
        const PINATA_SECRET = process.env.PINATA_SECRET_KEY

        if (PINATA_API_KEY && PINATA_SECRET) {
            const pinataRes = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'pinata_api_key': PINATA_API_KEY,
                    'pinata_secret_api_key': PINATA_SECRET,
                },
                body: JSON.stringify({
                    pinataContent: metadata,
                    pinataMetadata: { name: `ticket-${tokenId}` },
                }),
            })
            const pinataData = await pinataRes.json()
            if (pinataData.IpfsHash) {
                return NextResponse.json({
                    success: true,
                    ipfsUri: `ipfs://${pinataData.IpfsHash}`,
                    metadata,
                })
            }
        }

        // Fallback: return metadata URL langsung tanpa IPFS
        return NextResponse.json({
            success: true,
            ipfsUri: `https://ticketpr-six.vercel.app/api/metadata-static/${eventId}`,
            metadata,
        })

    } catch (error) {
        console.error('Metadata error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed' },
            { status: 500 }
        )
    }
}