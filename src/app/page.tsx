'use client'

export const dynamic = 'force-dynamic';

import Link from 'next/link'
import Navbar from './components/Navbar'

export default function Home() {
  return (
    <main style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', background: '#FFFFFF', color: '#0F0A1E', overflowX: 'hidden' }}>
      <Navbar />

      {/* HERO SECTION */}
      <section style={{ minHeight: '100vh', paddingTop: '72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)', clipPath: 'ellipse(100% 68% at 50% 32%)' }} />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', padding: '80px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '40px' }}>
          <div>
            <h1 style={{ fontSize: '64px', fontWeight: 800, color: 'white', marginBottom: '20px' }}>Discover & Own<br />Your Event<br />Tickets as NFTs 🎟️</h1>
            <p style={{ color: 'white', opacity: 0.9, marginBottom: '30px' }}>The most secure way to buy and sell event tickets.</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/market" style={{ background: 'white', color: '#7C3AED', borderRadius: '50px', padding: '14px 28px', fontWeight: 700, textDecoration: 'none' }}>
                🎫 Explore Tickets
              </Link>
              <Link href="/create-event" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: '50px', padding: '14px 28px', fontWeight: 600, textDecoration: 'none' }}>
                ✨ Create Event
              </Link>
            </div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '120px', filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.2))' }}>🎟️</div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ background: 'white', borderBottom: '1px solid #E8E4F5', padding: '28px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px' }}>
          {[
            { icon: '🎪', num: '2,400+', label: 'Live Events' },
            { icon: '🎫', num: '128K+', label: 'NFTs Minted' },
            { icon: '👥', num: '45K+', label: 'Active Users' },
            { icon: '💎', num: '$4.2M+', label: 'Trading Volume' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', background: '#F3F0FF', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{s.icon}</div>
              <div><div style={{ fontSize: '24px', fontWeight: 800 }}>{s.num}</div><div style={{ fontSize: '13px', color: '#9896B0' }}>{s.label}</div></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}