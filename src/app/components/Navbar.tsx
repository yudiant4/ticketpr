'use client'

import Link from 'next/link'

// Tambahkan deklarasi any agar Vercel tidak error saat build
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'w3m-button': any;
    }
  }
}

export default function Navbar() {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 48px',
      height: '72px',
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid #E8E4F5',
      fontFamily: 'Plus Jakarta Sans, sans-serif'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        {/* LOGO DENGAN EMOJI TIKET */}
        <Link href="/" style={{ textDecoration: 'none', color: '#0F0A1E', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)', 
            borderRadius: '10px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontSize: '18px',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.2)'
          }}>
            🎟️
          </div>
          <span style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px' }}>
            Ticket<span style={{ color: '#7C3AED' }}>Pro</span>
          </span>
        </Link>

        {/* MENU NAVIGASI */}
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link href="/market" style={{ textDecoration: 'none', color: '#4B4869', fontWeight: 600, fontSize: '14px' }}>Explore 🔍</Link>
          <Link href="/create-event" style={{ textDecoration: 'none', color: '#4B4869', fontWeight: 600, fontSize: '14px' }}>Create ✨</Link>
          <Link href="/verify" style={{ textDecoration: 'none', color: '#4B4869', fontWeight: 600, fontSize: '14px' }}>Verify ✅</Link>
          <Link href="/dashboard" style={{ textDecoration: 'none', color: '#4B4869', fontWeight: 600, fontSize: '14px' }}>Dashboard 👤</Link>
        </div>
      </div>

      {/* TOMBOL WALLET */}
      <w3m-button />
    </nav>
  )
}