import { NextRequest, NextResponse } from 'next/server'
import { uploadMetadataToIPFS, generateTicketMetadata } from '@/lib/pinata'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      eventId,
      eventName,
      date,
      venue,
      city,
      tier,
      tokenId,
      ownerAddress,
    } = body

    // Generate metadata
    const metadata = generateTicketMetadata({
      eventId,
      eventName,
      date,
      venue,
      city,
      tier,
      tokenId,
      ownerAddress,
      imageUrl: `https://ticketpr.vercel.app/api/ticket-image/${eventId}`,
    })

    // Upload to IPFS
    const ipfsUri = await uploadMetadataToIPFS(metadata)

    return NextResponse.json({
      success: true,
      ipfsUri,
      metadata,
    })
  } catch (error) {
    console.error('Metadata upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload metadata' },
      { status: 500 }
    )
  }
}