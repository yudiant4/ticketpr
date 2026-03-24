'use client'

export const dynamic = 'force-dynamic';

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  return (
    <main style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', background: '#FFFFFF', color: '#0F0A1E', overflowX: 'hidden' }}>

      {/* NAVBAR */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 48px', height: '72px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #E8E4F5',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '20px', color: '#0F0A1E', textDecoration: 'none' }}>
          {/* Logo Brand Konsisten */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="24" height="24" rx="6" fill="url(#brand-grad-home)" />
              <path d="M7 9H17M7 12H17M7 15H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <defs>
                <linearGradient id="brand-grad-home" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7C3AED" />
                  <stop offset="1" stopColor="#EC4899" />
                </linearGradient>
              </defs>
            </svg>
            <span style={{ fontWeight: 800, fontSize: '22px' }}>
              Ticket<span style={{ color: '#7C3AED' }}>Pro</span>
            </span>
          </div>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FAFAFF', border: '1px solid #E8E4F5', borderRadius: '50px', padding: '8px 16px', width: '260px' }}>
          <span style={{ color: '#9896B0', fontSize: '14px' }}>Search</span>
          <input type="text" placeholder="Events, tickets..." style={{ border: 'none', background: 'none', fontSize: '13px', color: '#0F0A1E', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link href="/create-event" style={{ fontSize: '14px', fontWeight: 600, color: '#4B4869', textDecoration: 'none' }}>Create Event</Link>
          <Link href="/market" style={{ fontSize: '14px', fontWeight: 600, color: '#4B4869', textDecoration: 'none' }}>Market</Link>
          <Link href="/verify" style={{ fontSize: '14px', fontWeight: 600, color: '#4B4869', textDecoration: 'none' }}>Verify</Link>
        </div>

        <w3m-button />
      </nav>

      {/* HERO SECTION */}
      <section style={{ minHeight: '100vh', paddingTop: '72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)', clipPath: 'ellipse(100% 68% at 50% 32%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1.5px, transparent 1.5px)', backgroundSize: '28px 28px', clipPath: 'ellipse(100% 68% at 50% 32%)' }} />

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', padding: '80px 48px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '40px', minHeight: 'calc(100vh - 72px)' }}>
          <div style={{ paddingBottom: '80px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '50px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, color: 'white', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '24px' }}>
              <div style={{ width: '7px', height: '7px', background: 'white', borderRadius: '50%' }} />
              Web3 NFT Ticketing Platform
            </div>
            <h1 style={{ fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: 800, lineHeight: 1.1, color: 'white', marginBottom: '20px', letterSpacing: '-0.02em' }}>
              Discover & Own<br />Your Event<br />Tickets as NFTs
            </h1>
            <p style={{ fontSize: '16px', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', maxWidth: '420px', marginBottom: '36px' }}>
              Buy, sell, and collect verified event tickets on the blockchain. Zero fraud, full ownership, and an instant secondary market.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/market" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', color: '#7C3AED', borderRadius: '50px', padding: '14px 28px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                Explore Tickets
              </Link>
              <Link href="/create-event" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: '50px', padding: '14px 28px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', backdropFilter: 'blur(8px)' }}>
                Create Event
              </Link>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '80px' }}>
            {/* Ikon Pengganti Emoji Besar */}
            <div style={{ width: '240px', height: '240px', background: 'rgba(255,255,255,0.1)', borderRadius: '40px', border: '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)' }}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9V5.2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2V9a2 2 0 0 0 0 4v3.8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V13a2 2 0 0 0 0-4Z" />
                <path d="M15 3v18M9 3v18" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR - EMOJI DIHAPUS */}
      <div style={{ background: 'white', borderTop: '1px solid #E8E4F5', borderBottom: '1px solid #E8E4F5', padding: '28px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '24px' }}>
          {[
            { num: '2,400+', label: 'Live Events' },
            { num: '128K+', label: 'NFTs Minted' },
            { num: '45K+', label: 'Active Users' },
            { num: '$4.2M+', label: 'Trading Volume' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', padding: '0 24px', borderRight: i < 3 ? '1px solid #E8E4F5' : 'none' }}>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F0A1E' }}>{s.num}</div>
              <div style={{ fontSize: '13px', color: '#9896B0', marginTop: '3px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS - EMOJI DIHAPUS */}
      <div style={{ background: '#FAFAFF', borderBottom: '1px solid #E8E4F5', padding: '80px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '50px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em' }}>How TicketPro Works</h2>
            <p style={{ color: '#9896B0', marginTop: '8px' }}>The next generation of event access</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '40px' }}>
            {[
              { num: '1', title: 'Connect Wallet', desc: 'Link MetaMask or Coinbase. Your wallet is your identity — no password needed.' },
              { num: '2', title: 'Mint Ticket', desc: 'Pick your event, choose your tier, and mint your NFT ticket directly to your wallet.' },
              { num: '3', title: 'Attend Event', desc: 'Show your unique NFT QR code at the gate for instant blockchain verification.' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #E8E4F5' }}>
                <div style={{ width: '48px', height: '48px', background: '#7C3AED', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontWeight: 800 }}>{s.num}</div>
                <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>{s.title}</div>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#9896B0' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#0F0A1E', color: 'white', padding: '60px 48px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '48px', marginBottom: '48px' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '20px', marginBottom: '14px' }}>TicketPro</div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '240px' }}>Web3 NFT ticketing platform for the next generation of live events.</p>
            </div>
            {[
              { title: 'Explore', links: ['Marketplace', 'Events', 'Collections'] },
              { title: 'Resources', links: ['Help Center', 'Blog', 'Contact'] },
              { title: 'Legal', links: ['Privacy', 'Terms', 'Cookies'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>{col.title}</h4>
                {col.links.map((l, j) => (
                  <a key={j} href="#" style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '10px' }}>{l}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            © 2026 TicketPro. All rights reserved.
          </div>
        </div>
      </footer>

    </main>
  )
}