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
          <Link href="/create" style={{ fontSize: '14px', fontWeight: 600, color: '#4B4869', textDecoration: 'none' }}>Create Event</Link>
          <Link href="/events" style={{ fontSize: '14px', fontWeight: 600, color: '#4B4869', textDecoration: 'none' }}>Market</Link>
          <Link href="/dashboard" style={{ fontSize: '14px', fontWeight: 600, color: '#4B4869', textDecoration: 'none' }}>Dashboard</Link>
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
              <Link href="/events" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', color: '#7C3AED', borderRadius: '50px', padding: '14px 28px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                Explore Tickets
              </Link>
              <Link href="/create" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: '50px', padding: '14px 28px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', backdropFilter: 'blur(8px)' }}>
                Create Event
              </Link>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '80px' }}>
            <div style={{ width: '240px', height: '240px', background: 'rgba(255,255,255,0.1)', borderRadius: '40px', border: '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)' }}>
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9V5.2a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2V9a2 2 0 0 0 0 4v3.8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V13a2 2 0 0 0 0-4Z" />
                <path d="M15 3v18M9 3v18" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0F0A1E', color: 'white', padding: '60px 48px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            © 2026 TicketPro. Built for the future of events.
          </div>
        </div>
      </footer>
    </main>
  )
}