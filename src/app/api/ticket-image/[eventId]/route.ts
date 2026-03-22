import { NextRequest, NextResponse } from 'next/server'

const eventEmojis: Record<string, string> = {
  '1': '🎵', '2': '🎤', '3': '💻',
  '4': '🎨', '5': '🎭', '6': '🚀',
}

const eventNames: Record<string, string> = {
  '1': 'Electronic Horizon Festival',
  '2': 'Neon City Rave Vol. 3',
  '3': 'Block Summit 2026',
  '4': 'Metamorphosis Art Fair',
  '5': 'Web3 Culture Festival',
  '6': 'DeFi Launchpad Night',
}

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = params
  const emoji = eventEmojis[eventId] || '🎟️'
  const name = eventNames[eventId] || 'TicketPro Event'

  const svg = `
    <svg width="500" height="500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#7C3AED"/>
          <stop offset="100%" style="stop-color:#EC4899"/>
        </linearGradient>
        <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.5" fill="rgba(255,255,255,0.15)"/>
        </pattern>
      </defs>

      <!-- Background -->
      <rect width="500" height="500" fill="url(#bg)" rx="24"/>
      <rect width="500" height="500" fill="url(#dots)" rx="24"/>

      <!-- Card -->
      <rect x="40" y="40" width="420" height="420" fill="rgba(255,255,255,0.1)"
        rx="16" stroke="rgba(255,255,255,0.3)" stroke-width="1.5"/>

      <!-- Emoji -->
      <text x="250" y="220" font-size="120" text-anchor="middle"
        dominant-baseline="middle">${emoji}</text>

      <!-- Event Name -->
      <text x="250" y="310" font-family="Arial, sans-serif" font-size="18"
        font-weight="bold" fill="white" text-anchor="middle">${name}</text>

      <!-- Brand -->
      <text x="250" y="345" font-family="Arial, sans-serif" font-size="14"
        fill="rgba(255,255,255,0.7)" text-anchor="middle">TicketPro NFT Ticket</text>

      <!-- Dashed line -->
      <line x1="80" y1="375" x2="420" y2="375"
        stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-dasharray="8,6"/>

      <!-- Bottom text -->
      <text x="250" y="410" font-family="Arial, sans-serif" font-size="12"
        fill="rgba(255,255,255,0.6)" text-anchor="middle">Powered by Ethereum · Sepolia</text>

      <!-- Logo -->
      <text x="250" y="440" font-family="Arial, sans-serif" font-size="13"
        font-weight="bold" fill="rgba(255,255,255,0.9)" text-anchor="middle">🎟️ TicketPro</text>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000',
    },
  })
}