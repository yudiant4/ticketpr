'use client'

import Link from 'next/link'

// --- TAMBAHAN: Deklarasi Global agar Vercel mengenali tag w3m-button ---
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'w3m-button': any;
      'w3m-network-button': any;
    }
  }
}
// -----------------------------------------------------------------------

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 48px',
      background: 'white',
      borderBottom: '1px solid #E8E4F5',
      fontFamily: 'Plus Jakarta Sans, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#0F0A1E', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="6" fill="url(#brand-grad)" />
              <path d="M7 9H17M7 12H17M7 15H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="brand-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7C3AED" />
                  <stop offset="1" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px' }}>
              Ticket<span style={{ color: '#7C3AED' }}>Pro</span>
            </span>
          </div>
        </Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link href="/market" style={{ textDecoration: 'none', color: '#4B4869', fontWeight: 600, fontSize: '14px' }}>Explore</Link>
          <Link href="/create-event" style={{ textDecoration: 'none', color: '#4B4869', fontWeight: 600, fontSize: '14px' }}>Create Event</Link>
          <Link href="/verify" style={{ textDecoration: 'none', color: '#4B4869', fontWeight: 600, fontSize: '14px' }}>Verify</Link>
          <Link href="/dashboard" style={{ textDecoration: 'none', color: '#4B4869', fontWeight: 600, fontSize: '14px' }}>Dashboard</Link>
        </div>
      </div>

      <w3m-button />
    </nav>
  )
}