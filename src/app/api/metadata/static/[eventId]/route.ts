import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    req: NextRequest,
    { params }: { params: { eventId: string } }
) {
    const { eventId } = params

    const events: Record<string, any> = {
        '1': { name: 'Electronic Horizon Festival', date: '28 Mar 2026', venue: 'JIEXPO Hall A', city: 'Jakarta' },
        '2': { name: 'Neon City Rave Vol. 3', date: '5 Apr 2026', venue: 'Potato Head', city: 'Bali' },
        '3': { name: 'Block Summit 2026', date: '12 Apr 2026', venue: 'Grand City Hall', city: 'Surabaya' },
        '4': { name: 'Metamorphosis Art Fair', date: '19 Apr 2026', venue: 'Gedung Sate', city: 'Bandung' },
        '5': { name: 'Web3 Culture Festival', date: '25 Apr 2026', venue: 'Prambanan Area', city: 'Yogyakarta' },
        '6': { name: 'DeFi Launchpad Night', date: '2 Mei 2026', venue: 'The Westin', city: 'Jakarta' },
    }

    const ev = events[eventId] || events['1']

    const metadata = {
        name: `TicketPro — ${ev.name}`,
        description: `Official NFT ticket for ${ev.name}. Date: ${ev.date} at ${ev.venue}, ${ev.city}.`,
        image: `https://ticketpr-six.vercel.app/api/ticket-image/${eventId}`,
        attributes: [
            { trait_type: 'Event Name', value: ev.name },
            { trait_type: 'Date', value: ev.date },
            { trait_type: 'Venue', value: ev.venue },
            { trait_type: 'City', value: ev.city },
            { trait_type: 'Platform', value: 'TicketPro' },
            { trait_type: 'Network', value: 'Sepolia' },
        ],
    }

    return NextResponse.json(metadata)
}