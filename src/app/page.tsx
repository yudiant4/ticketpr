'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// --- DATA DUMMY EVENT ---
const mockEvents = [
  { id: 1, name: "Electronic Horizon Festival", date: "28 Mar 2026", city: "Jakarta", price: "0.45", chain: "ETH", status: "🔴 Live", statusClass: "status-live", bg: "linear-gradient(135deg, #667EEA, #764BA2)", emoji: "🎵" },
  { id: 2, name: "Neon City Rave Vol. 3", date: "5 Apr 2026", city: "Bali", price: "0.18", chain: "MATIC", status: "🔥 Hot", statusClass: "status-hot", bg: "linear-gradient(135deg, #F093FB, #F5576C)", emoji: "🎤" },
  { id: 3, name: "Block Summit 2026", date: "12 Apr 2026", city: "Surabaya", price: "0.05", chain: "BASE", status: "⏳ Soon", statusClass: "status-soon", bg: "linear-gradient(135deg, #4FACFE, #00F2FE)", emoji: "🏟️" },
  { id: 4, name: "Metamorphosis Art Fair", date: "19 Apr 2026", city: "Bandung", price: "0.30", chain: "ETH", status: "🔴 Live", statusClass: "status-live", bg: "linear-gradient(135deg, #43E97B, #38F9D7)", emoji: "🎨" },
  { id: 5, name: "Web3 Culture Festival", date: "25 Apr 2026", city: "Yogyakarta", price: "0.22", chain: "MATIC", status: "🔥 Hot", statusClass: "status-hot", bg: "linear-gradient(135deg, #FA709A, #FEE140)", emoji: "🎭" },
  { id: 6, name: "DeFi Launchpad Night", date: "2 Mei 2026", city: "Jakarta", price: "0.12", chain: "BASE", status: "⏳ Soon", statusClass: "status-soon", bg: "linear-gradient(135deg, #A18CD1, #FBC2EB)", emoji: "🚀" }
]

export default function LandingPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [search, setSearch] = useState('')

  // LOGIKA PENCARIAN (Filter otomatis)
  const filteredEvents = mockEvents.filter((ev) =>
    ev.name.toLowerCase().includes(search.toLowerCase()) ||
    ev.city.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    // Deteksi Layar HP
    const handleResize = () => setIsMobile(window.innerWidth < 900)
    handleResize()
    window.addEventListener('resize', handleResize)

    // Animasi Scroll Reveal
    const reveals = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80)
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.1 })
    reveals.forEach(el => observer.observe(el))

    return () => {
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
    }
  }, [])

  return (
    <main className="landing-wrapper">

      {/* --- CSS KHUSUS HALAMAN INI --- */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .landing-wrapper {
          --purple: #7C3AED; --purple-light: #A855F7; --pink: #EC4899;
          --orange: #F97316; --bg2: #FAFAFF; --bg3: #F3F0FF;
          --text: #0F0A1E; --text2: #4B4869; --text3: #9896B0;
          --border: #E8E4F5; --shadow: rgba(124, 58, 237, 0.12);
          background: #FFFFFF; color: var(--text); overflow-x: hidden;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .hero { position: relative; overflow: hidden; padding-top: 40px; }
        .hero-gradient { position: absolute; inset: 0; background: linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%); clip-path: ellipse(100% 68% at 50% 32%); }
        .hero-dots { position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.15) 1.5px, transparent 1.5px); background-size: 28px 28px; clip-path: ellipse(100% 68% at 50% 32%); }
        .hero-inner { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 80px 48px 0; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 40px; min-height: 80vh; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.35); border-radius: 50px; padding: 6px 14px; font-size: 12px; font-weight: 600; color: white; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 24px; backdrop-filter: blur(8px); animation: fadeUp 0.6s ease forwards; opacity: 0; }
        .section-tag-dot { width: 7px; height: 7px; background: var(--purple); border-radius: 50%; animation: blink 1.5s ease-in-out infinite; }
        .hero-title { font-size: clamp(40px, 5vw, 64px); font-weight: 800; line-height: 1.1; color: white; margin-bottom: 20px; animation: fadeUp 0.6s 0.1s ease forwards; opacity: 0; }
        .hero-sub { font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.8); max-width: 420px; margin-bottom: 36px; animation: fadeUp 0.6s 0.2s ease forwards; opacity: 0; }
        .hero-ctas { display: flex; gap: 12px; animation: fadeUp 0.6s 0.3s ease forwards; opacity: 0; }
        
        .btn-primary { background: white; color: var(--purple); border: none; border-radius: 50px; padding: 14px 28px; font-weight: 700; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 20px rgba(0,0,0,0.15); text-decoration: none; display: inline-flex; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.2); }
        .btn-secondary { background: rgba(255,255,255,0.15); color: white; border: 1.5px solid rgba(255,255,255,0.4); border-radius: 50px; padding: 14px 28px; font-weight: 600; cursor: pointer; backdrop-filter: blur(8px); transition: 0.2s; text-decoration: none; display: inline-flex; }
        .btn-secondary:hover { background: rgba(255,255,255,0.25); }

        .hero-right { display: flex; align-items: center; justify-content: center; padding-bottom: 80px; animation: fadeUp 0.6s 0.2s ease forwards; opacity: 0; }
        .hero-illustration { position: relative; width: 420px; height: 420px; }
        .hero-illus-main { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 200px; background: white; border-radius: 28px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 24px 60px rgba(0,0,0,0.2); z-index: 3; animation: float 4s ease-in-out infinite; }
        .hero-illus-card { position: absolute; background: white; border-radius: 18px; padding: 14px 18px; box-shadow: 0 12px 40px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 600; color: var(--text); z-index: 2; }
        .card-1 { top: 30px; left: 10px; animation: float 4s 0.5s ease-in-out infinite; }
        .card-2 { top: 30px; right: 10px; animation: float 4s 1s ease-in-out infinite; }
        .card-3 { bottom: 60px; left: 0; animation: float 4s 1.5s ease-in-out infinite; }
        .card-4 { bottom: 60px; right: 0; animation: float 4s 0.8s ease-in-out infinite; }
        .illus-circle { position: absolute; border-radius: 50%; border: 1.5px dashed rgba(255,255,255,0.4); }
        .circle-1 { width: 320px; height: 320px; top: 50%; left: 50%; transform: translate(-50%,-50%); animation: spin 25s linear infinite; }
        .circle-2 { width: 380px; height: 380px; top: 50%; left: 50%; transform: translate(-50%,-50%); animation: spin 35s linear infinite reverse; }

        .stats-bar { background: white; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 28px 48px; }
        .stats-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .stat-item { display: flex; align-items: center; gap: 16px; padding: 0 24px; border-right: 1px solid var(--border); }
        .stat-item:last-child { border-right: none; }
        .stat-icon { width: 48px; height: 48px; background: var(--bg3); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
        .stat-num { font-size: 24px; font-weight: 800; color: var(--text); line-height: 1; margin-bottom: 3px; }

        .section { max-width: 1200px; margin: 0 auto; padding: 80px 48px; }
        .section-header { margin-bottom: 40px; }
        .section-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--purple); background: var(--bg3); border-radius: 50px; padding: 5px 12px; margin-bottom: 10px; }
        .section-title { font-size: clamp(26px, 3vw, 36px); font-weight: 800; color: var(--text); line-height: 1.15; }
        .events-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .event-card { background: white; border: 1px solid var(--border); border-radius: 20px; overflow: hidden; transition: 0.3s; cursor: pointer; }
        .event-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px var(--shadow); }
        .event-visual { height: 180px; position: relative; display: flex; align-items: center; justify-content: center; }
        .event-status { position: absolute; top: 14px; left: 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 50px; }
        .status-live { background: #DCFCE7; color: #16A34A; } .status-soon { background: #FEF3C7; color: #D97706; } .status-hot { background: #FEE2E2; color: #DC2626; }
        .event-chain { position: absolute; top: 14px; right: 14px; background: rgba(255,255,255,0.9); border-radius: 50px; padding: 4px 10px; font-size: 11px; font-weight: 700; color: var(--purple); }
        .btn-mint { background: linear-gradient(135deg, var(--purple), var(--purple-light)); color: white; border: none; border-radius: 50px; padding: 9px 20px; font-weight: 700; cursor: pointer; text-decoration: none;}

        .how-section { background: var(--bg2); padding: 80px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 50px; }
        .step-item { text-align: center; }
        .step-num { width: 72px; height: 72px; margin: 0 auto 24px; background: linear-gradient(135deg, var(--purple), var(--purple-light)); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 28px; box-shadow: 0 8px 24px rgba(124,58,237,0.35); color: white;}
        .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 50px; }
        .feature-card { background: white; border: 1.5px solid var(--border); border-radius: 20px; padding: 32px; display: flex; gap: 20px; transition: 0.3s; }
        .feature-card:hover { border-color: var(--purple); box-shadow: 0 8px 32px var(--shadow); transform: translateY(-3px); }
        .feature-icon-wrap { width: 56px; height: 56px; flex-shrink: 0; background: var(--bg3); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 26px; }

        .cta-section { padding: 0 48px 80px; }
        .cta-inner { max-width: 1200px; margin: 0 auto; background: linear-gradient(135deg, var(--purple) 0%, var(--pink) 100%); border-radius: 28px; padding: 64px 72px; display: flex; align-items: center; justify-content: space-between; gap: 40px; position: relative; overflow: hidden; }

        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes spin { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }

        @media (max-width: 900px) {
          .hero-inner { grid-template-columns: 1fr; padding: 40px 24px 0; text-align: center; }
          .hero-right { display: none; }
          .hero-ctas { justify-content: center; flex-direction: column; }
          .stats-inner, .events-grid, .steps-grid, .features-grid { grid-template-columns: 1fr; gap: 20px; }
          .stat-item { border-right: none; padding: 10px 0; }
          .cta-inner { flex-direction: column; padding: 40px 24px; text-align: center; }
          .section, .stats-bar, .cta-section { padding-left: 20px; padding-right: 20px; }
        }
      `}} />

      {/* --- NAVBAR --- */}
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="hero">
        <div className="hero-gradient"></div>
        <div className="hero-dots"></div>
        <div className="hero-inner">
          <div style={{ paddingBottom: '80px' }}>
            <div className="hero-badge">
              <div className="section-tag-dot" style={{ background: 'white' }}></div>
              Web3 NFT Ticketing Platform
            </div>
            <h1 className="hero-title">Discover &amp; Own<br />Your Event<br />Tickets as NFTs</h1>
            <p className="hero-sub">Buy, sell, and collect verified event tickets on the blockchain. Zero fraud, full ownership, instant secondary market — all in one place.</p>
            <div className="hero-ctas">
              <Link href="#explore" className="btn-primary">🎫 Explore Tickets</Link>
              <Link href="/create-event" className="btn-secondary">✨ Create Event</Link>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-illustration">
              <div className="illus-circle circle-1"></div>
              <div className="illus-circle circle-2"></div>
              <div className="hero-illus-card card-1">
                <div style={{ fontSize: '22px' }}>🔐</div>
                <div><div>Verified NFT</div><div style={{ fontSize: '11px', color: '#9896B0', fontWeight: 400 }}>On-chain proof</div></div>
              </div>
              <div className="hero-illus-card card-2">
                <div style={{ fontSize: '22px' }}>⚡</div>
                <div><div>Instant Mint</div><div style={{ fontSize: '11px', color: '#9896B0', fontWeight: 400 }}>Gas optimized</div></div>
              </div>
              <div className="hero-illus-card card-3">
                <div style={{ fontSize: '22px' }}>💸</div>
                <div><div>0.05 ETH</div><div style={{ fontSize: '11px', color: '#9896B0', fontWeight: 400 }}>Floor price</div></div>
              </div>
              <div className="hero-illus-card card-4">
                <div style={{ fontSize: '22px' }}>🛡️</div>
                <div><div>Anti-Fraud</div><div style={{ fontSize: '11px', color: '#9896B0', fontWeight: 400 }}>100% secure</div></div>
              </div>
              <div className="hero-illus-main">
                <div style={{ fontSize: '64px', marginBottom: '10px' }}>🎟️</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#7C3AED', letterSpacing: '0.05em' }}>NFT TICKET</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <div className="stats-bar reveal">
        <div className="stats-inner">
          <div className="stat-item"><div className="stat-icon">🎪</div><div><div className="stat-num">2,400+</div><div style={{ fontSize: '13px', color: '#9896B0' }}>Live Events</div></div></div>
          <div className="stat-item"><div className="stat-icon">🎫</div><div><div className="stat-num">128K+</div><div style={{ fontSize: '13px', color: '#9896B0' }}>NFTs Minted</div></div></div>
          <div className="stat-item"><div className="stat-icon">👥</div><div><div className="stat-num">45K+</div><div style={{ fontSize: '13px', color: '#9896B0' }}>Active Users</div></div></div>
          <div className="stat-item"><div className="stat-icon">💎</div><div><div className="stat-num">$4.2M+</div><div style={{ fontSize: '13px', color: '#9896B0' }}>Trading Volume</div></div></div>
        </div>
      </div>

      {/* --- EVENTS SECTION + SEARCH --- */}
      <div className="section reveal" id="explore">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div className="section-tag"><div className="section-tag-dot"></div> Marketplace</div>
            <h2 className="section-title">Explore Trending Events</h2>
            <p style={{ fontSize: '14px', color: '#9896B0', marginTop: '6px' }}>Most popular NFT tickets in the marketplace</p>
          </div>

          {/* Kolom Pencarian */}
          <div style={{ display: 'flex', background: '#FAFAFF', border: '1.5px solid #E8E4F5', borderRadius: '50px', padding: '10px 20px', width: isMobile ? '100%' : '350px', alignItems: 'center', gap: '10px' }}>
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search by event name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'none', outline: 'none', width: '100%', fontSize: '14px', fontFamily: 'inherit', color: 'var(--text)' }}
            />
          </div>
        </div>

        <div className="events-grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((ev) => (
              <Link href="/market" key={ev.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="event-card">
                  <div className="event-visual" style={{ background: ev.bg }}>
                    <span className={`event-status ${ev.statusClass}`}>{ev.status}</span>
                    <span className="event-chain">{ev.chain}</span>
                    <div style={{ fontSize: '64px', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))' }}>{ev.emoji}</div>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>{ev.name}</div>
                    <div style={{ fontSize: '13px', color: '#9896B0', marginBottom: '16px' }}>📅 <span style={{ color: '#4B4869', fontWeight: 500 }}>{ev.date}</span> &nbsp;·&nbsp; 📍 <span style={{ color: '#4B4869', fontWeight: 500 }}>{ev.city}</span></div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E8E4F5', paddingTop: '14px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#9896B0' }}>Floor Price</div>
                        <div style={{ fontSize: '17px', fontWeight: 800, color: '#7C3AED' }}>{ev.price} <span style={{ fontSize: '11px', color: '#9896B0', fontWeight: 400 }}>ETH</span></div>
                      </div>
                      <button className="btn-mint">Mint Ticket</button>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', background: '#F3F0FF', borderRadius: '24px', border: '1px dashed #E8E4F5' }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔍</div>
              <h3 style={{ fontWeight: 800, color: '#0F0A1E' }}>No events found</h3>
              <p style={{ color: '#9896B0' }}>We couldn't find any events matching "{search}".</p>
            </div>
          )}
        </div>
      </div>

      {/* --- HOW IT WORKS --- */}
      <div className="how-section">
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>
          <div className="section-header reveal">
            <div>
              <div className="section-tag"><div className="section-tag-dot"></div> How It Works</div>
              <h2 className="section-title">3 Easy Steps to Get Started</h2>
              <p style={{ fontSize: '14px', color: '#9896B0', marginTop: '6px' }}>From wallet to event gate in minutes</p>
            </div>
          </div>
          <div className="steps-grid reveal">
            <div className="step-item">
              <div style={{ position: 'relative', width: '72px', height: '72px', margin: '0 auto 24px' }}>
                <div className="step-num">🔗</div>
                <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '22px', height: '22px', background: '#F97316', borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: 'white' }}>1</div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Connect Your Wallet</div>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#9896B0' }}>Link MetaMask or WalletConnect. Your wallet is your identity — no email or password needed.</p>
            </div>
            <div className="step-item">
              <div style={{ position: 'relative', width: '72px', height: '72px', margin: '0 auto 24px' }}>
                <div className="step-num">🎫</div>
                <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '22px', height: '22px', background: '#F97316', borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: 'white' }}>2</div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Browse &amp; Mint Ticket</div>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#9896B0' }}>Find your event, pick your seat tier, and mint your NFT ticket directly to your wallet in seconds.</p>
            </div>
            <div className="step-item">
              <div style={{ position: 'relative', width: '72px', height: '72px', margin: '0 auto 24px' }}>
                <div className="step-num">🎉</div>
                <div style={{ position: 'absolute', top: '-6px', right: '-6px', width: '22px', height: '22px', background: '#F97316', borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 800, color: 'white' }}>3</div>
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>Attend the Event</div>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#9896B0' }}>Show your NFT QR code at the gate. Blockchain verification confirms authenticity instantly.</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- FEATURES --- */}
      <div style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>
          <div className="section-header reveal">
            <div>
              <div className="section-tag"><div className="section-tag-dot"></div> Why TicketPro</div>
              <h2 className="section-title">Everything You Need for<br />NFT Ticketing</h2>
            </div>
          </div>
          <div className="features-grid reveal">
            <div className="feature-card">
              <div className="feature-icon-wrap">🔐</div>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>On-Chain Verification</div>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#9896B0' }}>Every ticket is a unique NFT. Scan QR to verify authenticity instantly on the blockchain.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap">💸</div>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>Smart Royalty System</div>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#9896B0' }}>Organizers earn royalties on every secondary sale automatically via smart contracts.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap">🛡️</div>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>Anti-Scalping Controls</div>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#9896B0' }}>Programmable price caps and transfer restrictions embedded in smart contract logic.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap">🎭</div>
              <div>
                <div style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>Collectible Post-Event NFT</div>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#9896B0' }}>Tickets transform into collectibles after the event — preserving memories forever on-chain.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CTA BANNER --- */}
      <div className="cta-section reveal">
        <div className="cta-inner">
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px', pointerEvents: 'none' }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 800, color: 'white', marginBottom: '12px' }}>Ready to Create Your<br />First NFT Event?</h2>
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', maxWidth: '400px' }}>Join 2,400+ organizers on TicketPro. Deploy your smart ticket contract in under 5 minutes.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', position: 'relative', zIndex: 1, flexDirection: isMobile ? 'column' : 'row' }}>
            <Link href="/create-event" style={{ background: 'white', color: '#7C3AED', padding: '14px 28px', borderRadius: '50px', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>🚀 Create Event</Link>
            <Link href="/market" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)', padding: '14px 28px', borderRadius: '50px', fontWeight: 600, textDecoration: 'none', textAlign: 'center' }}>Explore Market →</Link>
          </div>
        </div>
      </div>

      {/* --- FOOTER ASLI KITA --- */}
      <Footer />

    </main>
  )
}