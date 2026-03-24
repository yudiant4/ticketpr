'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'

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
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 800 }}>TP</div>
          <span style={{ fontWeight: 800, fontSize: '20px' }}>Ticket<span style={{ color: '#7C3AED' }}>Pro</span></span>
        </Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link href="/market" style={{ textDecoration: 'none', color: '#4B4869', fontWeight: 600, fontSize: '14px' }}>Explore</Link>
          <Link href="/create-event" style={{ textDecoration: 'none', color: '#4B4869', fontWeight: 600, fontSize: '14px' }}>Create Event</Link>
          <Link href="/verify" style={{ textDecoration: 'none', color: '#4B4869', fontWeight: 600, fontSize: '14px' }}>Verify</Link>
          <Link href="/dashboard" style={{ textDecoration: 'none', color: '#4B4869', fontWeight: 600, fontSize: '14px' }}>Dashboard</Link>
        </div>
      </div>

      <ConnectButton />
    </nav>
  )
}