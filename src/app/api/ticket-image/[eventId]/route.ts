import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    req: NextRequest,
    { params }: { params: { eventId: string } }
) {
    const emojis: Record<string, string> = {
        '1': '🎵', '2': '🎤', '3': '💻',
        '4': '🎨', '5': '🎭', '6': '🚀',
    }

    const names: Record<string, string> = {
        '1': 'Electronic Horizon', '2': 'Neon City Rave',
        '3': 'Block Summit', '4': 'Metamorphosis Art',
        '5': 'Web3 Culture', '6': 'DeFi Launchpad',
    }

    const emoji = emojis[params.eventId] || '🎟️'
    const name = names[params.eventId] || 'TicketPro Event'

    const svg = `<svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#7C3AED"/>
        <stop offset="100%" style="stop-color:#EC4899"/>
      </linearGradient>
      <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.5" fill="rgba(255,255,255,0.15)"/>
      </pattern>
    </defs>
    <rect width="500" height="500" fill="url(#bg)" rx="24"/>
    <rect width="500" height="500" fill="url(#dots)" rx="24"/>
    <rect x="40" y="40" width="420" height="420" fill="rgba(255,255,255,0.1)" rx="16" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>
    <text x="250" y="230" font-size="120" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    <text x="250" y="320" font-family="Arial,sans-serif" font-size="22" font-weight="bold" fill="white" text-anchor="middle">${name}</text>
    <text x="250" y="355" font-family="Arial,sans-serif" font-size="14" fill="rgba(255,255,255,0.7)" text-anchor="middle">TicketPro NFT Ticket</text>
    <line x1="80" y1="385" x2="420" y2="385" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-dasharray="8,6"/>
    <text x="250" y="420" font-family="Arial,sans-serif" font-size="13" fill="rgba(255,255,255,0.9)" text-anchor="middle" font-weight="bold">🎟️ TicketPro · Sepolia</text>
  </svg>`

    return new NextResponse(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=31536000',
        },
    })
}