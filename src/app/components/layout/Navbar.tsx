'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Navbar() {
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      padding: '0 48px', height: '72px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #E8E4F5',
    }}>
      <Link href="/" style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        fontWeight: 800, fontSize: '20px', color: '#0F0A1E', textDecoration: 'none'
      }}>
        <div style={{
          width: '34px', height: '34px',
          background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
          borderRadius: '10px', display: 'flex',
          alignItems: 'center', justifyContent: 'center', fontSize: '16px'
        }}>🎟️</div>
        Ticket<span style={{ color: '#7C3AED' }}>Pro</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px',
        background: '#FAFAFF', border: '1px solid #E8E4F5',
        borderRadius: '50px', padding: '8px 16px', width: '260px'
      }}>
        <span style={{ color: '#9896B0', fontSize: '14px' }}>🔍</span>
        <input type="text" placeholder="Search events, tickets..."
          style={{ border: 'none', background: 'none', fontSize: '13px',
            color: '#0F0A1E', outline: 'none', width: '100%',
            fontFamily: 'inherit'
          }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <Link href="/create-event" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Create Event</Link>
<Link href="/market" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Market</Link>
<Link href="/verify" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Verify</Link>
      </div>

      <ConnectButton />
    </nav>
  )
}
