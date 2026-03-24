'use client'

export const dynamic = 'force-dynamic';

import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  return (
    <main style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', background: '#FFFFFF', color: '#0F0A1E', overflowX: 'hidden' }}>

      {/* CSS UNTUK VERSI HP (MOBILE RESPONSIVE) */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .nav-container { padding: 0 48px; }
          .nav-search { display: flex; }
          .nav-links { display: flex; }
          .hero-grid { grid-template-columns: 1fr 1fr; }
          .stats-grid { grid-template-columns: repeat(4, 1fr); }
          .events-grid { grid-template-columns: repeat(3, 1fr); }
          .steps-grid { grid-template-columns: repeat(3, 1fr); }
          .cta-flex { flex-direction: row; }
          .footer-grid { grid-template-columns: 2fr 1fr 1fr 1fr; }
          .hero-title { font-size: clamp(40px, 5vw, 64px); }
          
          @media (max-width: 992px) {
            .nav-container { padding: 0 20px; }
            .nav-search { display: none !important; }
            .nav-links { display: none !important; }
            .hero-grid { grid-template-columns: 1fr !important; text-align: center; padding: 40px 20px 0 !important; }
            .hero-emoji { display: none !important; }
            .hero-buttons { justify-content: center; }
            .hero-desc { margin: 0 auto 36px !important; }
            .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 16px !important; }
            .stats-item { border-right: none !important; padding: 0 !important; }
            .events-grid { grid-template-columns: 1fr !important; }
            .steps-grid { grid-template-columns: 1fr !important; gap: 30px !important; }
            .cta-flex { flex-direction: column !important; text-align: center; padding: 40px 30px !important; }
            .cta-buttons { justify-content: center; }
            .footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
            .section-padding { padding: 40px 20px !important; }
          }
        `
      }} />

      {/* NAVBAR */}
      <nav className="nav-container" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #E8E4F5',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '20px', color: '#0F0A1E', textDecoration: 'none' }}>
          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🎟️</div>
          Ticket<span style={{ color: '#7C3AED' }}>Pro</span>
        </Link>
        <div className="nav-search" style={{ alignItems: 'center', gap: '8px', background: '#FAFAFF', border: '1px solid #E8E4F5', borderRadius: '50px', padding: '8px 16px', width: '260px' }}>
          <span style={{ color: '#9896B0', fontSize: '14px' }}>🔍</span>
          <input type="text" placeholder="Search events, tickets..." style={{ border: 'none', background: 'none', fontSize: '13px', color: '#0F0A1E', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
        </div>
        <div className="nav-links" style={{ alignItems: 'center', gap: '28px' }}>
          <Link href="/create-event" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Create Event</Link>
          <Link href="/market" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Market</Link>
          <Link href="/verify" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Verify</Link>
        </div>
        <w3m-button />
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', paddingTop: '72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%)', clipPath: 'ellipse(100% 68% at 50% 32%)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1.5px, transparent 1.5px)', backgroundSize: '28px 28px', clipPath: 'ellipse(100% 68% at 50% 32%)' }} />
        <div className="hero-grid" style={{ position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto', padding: '80px 48px 0', display: 'grid', alignItems: 'center', gap: '40px', minHeight: 'calc(100vh - 72px)' }}>
          <div style={{ paddingBottom: '80px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '50px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, color: 'white', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '24px' }}>
              <div style={{ width: '7px', height: '7px', background: 'white', borderRadius: '50%' }} />
              Web3 NFT Ticketing Platform
            </div>
            <h1 className="hero-title" style={{ fontWeight: 800, lineHeight: 1.1, color: 'white', marginBottom: '20px', letterSpacing: '-0.02em' }}>
              Discover &amp; Own<br />Your Event<br />Tickets as NFTs
            </h1>
            <p className="hero-desc" style={{ fontSize: '16px', lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', maxWidth: '420px', marginBottom: '36px' }}>
              Buy, sell, and collect verified event tickets on the blockchain. Zero fraud, full ownership, instant secondary market.
            </p>
            <div className="hero-buttons" style={{ display: 'flex', gap: '12px' }}>
              <Link href="/market" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', color: '#7C3AED', borderRadius: '50px', padding: '14px 28px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                🎫 Explore Tickets
              </Link>
              <Link href="/create-event" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: '50px', padding: '14px 28px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', backdropFilter: 'blur(8px)' }}>
                ✨ Create Event
              </Link>
            </div>
          </div>
          <div className="hero-emoji" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '80px' }}>
            <div style={{ fontSize: '120px', filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.3))' }}>🎟️</div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="section-padding" style={{ background: 'white', borderTop: '1px solid #E8E4F5', borderBottom: '1px solid #E8E4F5', padding: '28px 48px' }}>
        <div className="stats-grid" style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gap: '24px' }}>
          {[
            { icon: '🎪', num: '2,400+', label: 'Live Events' },
            { icon: '🎫', num: '128K+', label: 'NFTs Minted' },
            { icon: '👥', num: '45K+', label: 'Active Users' },
            { icon: '💎', num: '$4.2M+', label: 'Trading Volume' },
          ].map((s, i) => (
            <div key={i} className="stats-item" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '0 24px', borderRight: i < 3 ? '1px solid #E8E4F5' : 'none' }}>
              <div style={{ width: '48px', height: '48px', background: '#F3F0FF', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: '13px', color: '#9896B0', marginTop: '3px' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UPCOMING EVENTS */}
      <div className="section-padding" style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 48px' }}>
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#7C3AED', background: '#F3F0FF', borderRadius: '50px', padding: '5px 12px', marginBottom: '10px' }}>
            <div style={{ width: '7px', height: '7px', background: '#7C3AED', borderRadius: '50%' }} />
            Upcoming Events
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-0.02em' }}>Trending Tickets Right Now</h2>
        </div>
        <div className="events-grid" style={{ display: 'grid', gap: '24px' }}>
          {[
            { emoji: '🎵', name: 'Electronic Horizon Festival', date: '28 Mar 2026', city: 'Jakarta', price: '0.45', status: '🔴 Live', chain: 'ETH', bg: 'linear-gradient(135deg,#667EEA,#764BA2)' },
            { emoji: '🎤', name: 'Neon City Rave Vol. 3', date: '5 Apr 2026', city: 'Bali', price: '0.18', status: '🔥 Hot', chain: 'MATIC', bg: 'linear-gradient(135deg,#F093FB,#F5576C)' },
            { emoji: '💻', name: 'Block Summit 2026', date: '12 Apr 2026', city: 'Surabaya', price: '0.05', status: '⏳ Soon', chain: 'BASE', bg: 'linear-gradient(135deg,#4FACFE,#00F2FE)' },
            { emoji: '🎨', name: 'Metamorphosis Art Fair', date: '19 Apr 2026', city: 'Bandung', price: '0.30', status: '🔴 Live', chain: 'ETH', bg: 'linear-gradient(135deg,#43E97B,#38F9D7)' },
            { emoji: '🎭', name: 'Web3 Culture Festival', date: '25 Apr 2026', city: 'Yogyakarta', price: '0.22', status: '🔥 Hot', chain: 'MATIC', bg: 'linear-gradient(135deg,#FA709A,#FEE140)' },
            { emoji: '🚀', name: 'DeFi Launchpad Night', date: '2 Mei 2026', city: 'Jakarta', price: '0.12', status: '⏳ Soon', chain: 'BASE', bg: 'linear-gradient(135deg,#A18CD1,#FBC2EB)' },
          ].map((ev, i) => (
            <Link href={`/ticket/${i + 1}`} key={i} style={{ textDecoration: 'none', background: 'white', border: '1px solid #E8E4F5', borderRadius: '18px', overflow: 'hidden', display: 'block', transition: 'transform 0.3s' }}>
              <div style={{ height: '160px', background: ev.bg, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '56px', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.2))' }}>{ev.emoji}</span>
                <span style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '50px', background: 'rgba(255,255,255,0.9)', color: '#0F0A1E' }}>{ev.status}</span>
                <span style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '50px', background: 'rgba(255,255,255,0.9)', color: '#7C3AED' }}>{ev.chain}</span>
              </div>
              <div style={{ padding: '18px' }}>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F0A1E', marginBottom: '5px' }}>{ev.name}</div>
                <div style={{ fontSize: '12px', color: '#9896B0', marginBottom: '14px' }}>📅 {ev.date} · 📍 {ev.city}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E8E4F5', paddingTop: '14px' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#9896B0' }}>Floor Price</div>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#7C3AED' }}>{ev.price} ETH</div>
                  </div>
                  <button style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: 'white', border: 'none', borderRadius: '50px', padding: '9px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                    Mint Ticket
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="section-padding" style={{ background: '#FAFAFF', borderTop: '1px solid #E8E4F5', borderBottom: '1px solid #E8E4F5', padding: '80px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '50px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#7C3AED', background: '#F3F0FF', borderRadius: '50px', padding: '5px 12px', marginBottom: '10px' }}>
              <div style={{ width: '7px', height: '7px', background: '#7C3AED', borderRadius: '50%' }} />
              How It Works
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3vw, 36px)', fontWeight: 800, letterSpacing: '-0.02em' }}>3 Easy Steps to Get Started</h2>
          </div>
          <div className="steps-grid" style={{ display: 'grid', gap: '40px' }}>
            {[
              { icon: '🔗', num: '1', title: 'Connect Your Wallet', desc: 'Link MetaMask, Coinbase Wallet, or WalletConnect. Your wallet is your identity — no email or password needed.' },
              { icon: '🎫', num: '2', title: 'Browse & Mint Ticket', desc: 'Find your event, pick your seat tier, and mint your NFT ticket directly to your wallet in seconds.' },
              { icon: '🎉', num: '3', title: 'Attend the Event', desc: 'Show your NFT QR code at the gate. Blockchain verification confirms authenticity instantly.' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', width: '72px', height: '72px', margin: '0 auto 24px' }}>
                  <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg,#7C3AED,#A855F7)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', boxShadow: '0 8px 24px rgba(124,58,237,0.35)' }}>{s.icon}</div>
                  <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '22px', height: '22px', background: '#F97316', borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: 'white' }}>{s.num}</div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>{s.title}</div>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#9896B0' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA BANNER */}
      <div className="section-padding" style={{ padding: '80px 48px' }}>
        <div className="cta-flex" style={{ maxWidth: '1200px', margin: '0 auto', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius: '28px', padding: '64px 72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 'clamp(24px,3vw,38px)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '12px' }}>Ready to Create Your<br />First NFT Event?</h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, maxWidth: '400px' }}>Join 2,400+ organizers on TicketPro. Deploy in under 5 minutes.</p>
          </div>
          <div className="cta-buttons" style={{ display: 'flex', gap: '12px', flexShrink: 0, position: 'relative', zIndex: 1 }}>
            <Link href="/create-event" style={{ textDecoration: 'none' }}><button style={{ background: 'white', color: '#7C3AED', border: 'none', borderRadius: '50px', padding: '14px 28px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>🚀 Create Event</button></Link>
            <button style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)', borderRadius: '50px', padding: '14px 28px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>Learn More →</button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="section-padding" style={{ background: '#0F0A1E', color: 'white', padding: '60px 48px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="footer-grid" style={{ display: 'grid', gap: '48px', marginBottom: '48px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '18px', marginBottom: '14px' }}>
                <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🎟️</div>
                TicketPro
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '240px' }}>The Web3 NFT ticketing platform for the next generation of live events.</p>
            </div>
            {[
              { title: 'Explore', links: ['Marketplace', 'Live Events', 'Upcoming', 'Collections'] },
              { title: 'Create', links: ['Create Event', 'Dashboard', 'Smart Contracts', 'API Docs'] },
              { title: 'Support', links: ['Help Center', 'Community', 'Blog', 'Contact'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>{col.title}</h4>
                {col.links.map((l, j) => (
                  <a key={j} href="#" style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '10px' }}>{l}</a>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>© 2026 TicketPro. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((l, i) => (
                <a key={i} href="#" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>

    </main>
  )
}