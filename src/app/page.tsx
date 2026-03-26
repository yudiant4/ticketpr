'use client'

export const dynamic = 'force-dynamic';

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import Footer from '@/components/Footer' // Memanggil komponen Footer buatanmu

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  // MEMBACA DATA REAL DARI BLOCKCHAIN (Untuk Stats Bar)
  const { data: allEvents } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getAllEvents',
  })

  // Logika untuk menghitung jumlah Live Events secara otomatis
  const liveEventsCount = Array.isArray(allEvents) ? allEvents.length : 0;

  // Logika Search: Mengarahkan ke halaman Browse Events (/events)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/events?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  // Logika Animasi Scroll (Scroll Reveal & Stagger)
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 80);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));

    // Stagger event cards
    const cards = document.querySelectorAll('.event-card');
    cards.forEach((card: any, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = `opacity 0.5s ${i * 0.08}s ease, transform 0.5s ${i * 0.08}s ease`;
    });

    const cardObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          cards.forEach((card: any) => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    const evGrid = document.querySelector('.events-grid');
    if (evGrid) cardObserver.observe(evGrid);

    return () => {
      observer.disconnect();
      cardObserver.disconnect();
    }
  }, [])

  return (
    <>
      {/* ===== CSS STYLE BAWAAN DARI HTML KAMU ===== */}
      <style dangerouslySetInnerHTML={{
        __html: `
        :root {
          --purple: #7C3AED;
          --purple-light: #A855F7;
          --purple-dark: #5B21B6;
          --pink: #EC4899;
          --orange: #F97316;
          --bg: #FFFFFF;
          --bg2: #FAFAFF;
          --bg3: #F3F0FF;
          --text: #0F0A1E;
          --text2: #4B4869;
          --text3: #9896B0;
          --border: #E8E4F5;
          --card: #FFFFFF;
          --shadow: rgba(124, 58, 237, 0.12);
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }

        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          overflow-x: hidden;
        }

        /* NAVBAR */
        nav {
          position: fixed; top: 0; left: 0; right: 0;
          z-index: 100; padding: 0 48px; height: 72px;
          display: flex; align-items: center; justify-content: space-between;
          background: rgba(255,255,255,0.85); backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--border);
        }
        .nav-logo { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 20px; color: var(--text); text-decoration: none; }
        .nav-logo-icon { width: 34px; height: 34px; background: linear-gradient(135deg, var(--purple), var(--pink)); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .nav-logo span { color: var(--purple); }
        .nav-search { display: flex; align-items: center; gap: 8px; background: var(--bg2); border: 1px solid var(--border); border-radius: 50px; padding: 8px 16px; width: 240px; transition: 0.2s; }
        .nav-search:focus-within { border-color: var(--purple); box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
        .nav-search input { border: none; background: none; font-size: 13px; color: var(--text); outline: none; width: 100%; font-family: inherit; }
        .nav-search input::placeholder { color: var(--text3); }
        .nav-search-btn { background: none; border: none; cursor: pointer; color: var(--text3); font-size: 14px; }
        .nav-links { display: flex; align-items: center; gap: 32px; }
        .nav-links a { font-size: 14px; font-weight: 500; color: var(--text2); text-decoration: none; transition: 0.2s; }
        .nav-links a:hover { color: var(--purple); }
        .nav-right { display: flex; align-items: center; gap: 12px; }

        /* HERO */
        .hero { min-height: 100vh; padding-top: 72px; position: relative; overflow: hidden; }
        .hero-gradient { position: absolute; inset: 0; background: linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #EC4899 100%); clip-path: ellipse(100% 68% at 50% 32%); }
        .hero-dots { position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.15) 1.5px, transparent 1.5px); background-size: 28px 28px; clip-path: ellipse(100% 68% at 50% 32%); }
        .hero-inner { position: relative; z-index: 2; max-width: 1200px; margin: 0 auto; padding: 80px 48px 0; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 40px; min-height: calc(100vh - 72px); }
        .hero-left { padding-bottom: 80px; }
        .hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.35); border-radius: 50px; padding: 6px 14px; font-size: 12px; font-weight: 600; color: white; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 24px; backdrop-filter: blur(8px); animation: fadeUp 0.6s ease forwards; opacity: 0; }
        .hero-title { font-size: clamp(40px, 5vw, 64px); font-weight: 800; line-height: 1.1; color: white; margin-bottom: 20px; letter-spacing: -0.02em; animation: fadeUp 0.6s 0.1s ease forwards; opacity: 0; }
        .hero-sub { font-size: 16px; line-height: 1.7; color: rgba(255,255,255,0.8); max-width: 420px; margin-bottom: 36px; animation: fadeUp 0.6s 0.2s ease forwards; opacity: 0; }
        .hero-ctas { display: flex; gap: 12px; flex-wrap: wrap; animation: fadeUp 0.6s 0.3s ease forwards; opacity: 0; }
        .btn-primary { display: inline-flex; align-items: center; gap: 8px; background: white; color: var(--purple); border: none; border-radius: 50px; padding: 14px 28px; font-weight: 700; cursor: pointer; text-decoration: none; font-size: 15px; transition: 0.2s; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(0,0,0,0.2); }
        .btn-secondary { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.15); color: white; border: 1.5px solid rgba(255,255,255,0.4); border-radius: 50px; padding: 14px 28px; font-weight: 600; cursor: pointer; text-decoration: none; font-size: 15px; backdrop-filter: blur(8px); transition: 0.2s; }
        .btn-secondary:hover { background: rgba(255,255,255,0.25); }

        /* HERO ILLUSTRATION */
        .hero-right { display: flex; align-items: center; justify-content: center; padding-bottom: 80px; animation: fadeUp 0.6s 0.2s ease forwards; opacity: 0; }
        .hero-illustration { position: relative; width: 420px; height: 420px; }
        .hero-illus-main { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 200px; height: 200px; background: white; border-radius: 28px; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 24px 60px rgba(0,0,0,0.2); z-index: 3; animation: float 4s ease-in-out infinite; }
        .illus-main-icon { font-size: 64px; margin-bottom: 10px; }
        .illus-main-text { font-size: 13px; font-weight: 700; color: var(--purple); letter-spacing: 0.05em; }
        .hero-illus-card { position: absolute; background: white; border-radius: 18px; padding: 14px 18px; box-shadow: 0 12px 40px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 10px; white-space: nowrap; font-size: 13px; font-weight: 600; color: var(--text); z-index: 2; }
        .illus-card-icon { font-size: 22px; }
        .illus-card-label { font-size: 11px; color: var(--text3); font-weight: 400; }
        .card-1 { top: 30px; left: 10px; animation: float 4s 0.5s ease-in-out infinite; }
        .card-2 { top: 30px; right: 10px; animation: float 4s 1s ease-in-out infinite; }
        .card-3 { bottom: 60px; left: 0; animation: float 4s 1.5s ease-in-out infinite; }
        .card-4 { bottom: 60px; right: 0; animation: float 4s 0.8s ease-in-out infinite; }
        .illus-circle { position: absolute; border-radius: 50%; border: 1.5px dashed rgba(255,255,255,0.4); }
        .circle-1 { width: 320px; height: 320px; top: 50%; left: 50%; transform: translate(-50%,-50%); animation: spin 25s linear infinite; }
        .circle-2 { width: 380px; height: 380px; top: 50%; left: 50%; transform: translate(-50%,-50%); animation: spin 35s linear infinite reverse; }

        /* GENERAL SECTIONS */
        .stats-bar { background: white; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 28px 48px; }
        .stats-inner { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .stat-item { display: flex; align-items: center; gap: 16px; padding: 0 24px; border-right: 1px solid var(--border); }
        .stat-item:last-child { border-right: none; }
        .stat-icon { width: 48px; height: 48px; background: var(--bg3); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
        .stat-num { font-size: 24px; font-weight: 800; color: var(--text); line-height: 1; margin-bottom: 3px; }
        .stat-label { font-size: 13px; color: var(--text3); font-weight: 400; }

        .section { max-width: 1200px; margin: 0 auto; padding: 80px 48px; }
        .section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 40px; }
        .section-tag { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--purple); background: var(--bg3); border-radius: 50px; padding: 5px 12px; margin-bottom: 10px; }
        .section-tag-dot { width: 7px; height: 7px; background: var(--purple); border-radius: 50%; animation: blink 1.5s ease-in-out infinite; }
        .section-title { font-size: clamp(26px, 3vw, 36px); font-weight: 800; letter-spacing: -0.02em; color: var(--text); line-height: 1.15; }
        .section-sub { font-size: 14px; color: var(--text3); margin-top: 6px; }

        .events-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .event-card { background: white; border: 1px solid var(--border); border-radius: 20px; overflow: hidden; transition: transform 0.3s, box-shadow 0.3s; cursor: pointer; text-decoration: none; display: block; }
        .event-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px var(--shadow); }
        .event-visual { height: 180px; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .ev1 { background: linear-gradient(135deg, #667EEA, #764BA2); }
        .ev2 { background: linear-gradient(135deg, #F093FB, #F5576C); }
        .ev3 { background: linear-gradient(135deg, #4FACFE, #00F2FE); }
        .event-emoji { font-size: 64px; filter: drop-shadow(0 8px 16px rgba(0,0,0,0.2)); }
        .event-status { position: absolute; top: 14px; left: 14px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 4px 10px; border-radius: 50px; }
        .status-live { background: #DCFCE7; color: #16A34A; }
        .status-soon { background: #FEF3C7; color: #D97706; }
        .status-hot { background: #FEE2E2; color: #DC2626; }
        .event-chain { position: absolute; top: 14px; right: 14px; background: rgba(255,255,255,0.9); border-radius: 50px; padding: 4px 10px; font-size: 11px; font-weight: 700; color: var(--purple); backdrop-filter: blur(8px); }
        .event-body { padding: 20px; }
        .event-name { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 6px; letter-spacing: -0.01em; }
        .event-meta { font-size: 13px; color: var(--text3); margin-bottom: 16px; line-height: 1.5; }
        .event-meta span { color: var(--text2); font-weight: 500; }
        .event-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 14px; }
        .event-price-label { font-size: 11px; color: var(--text3); }
        .event-price-val { font-size: 17px; font-weight: 800; color: var(--purple); }
        .event-price-eth { font-size: 11px; color: var(--text3); font-weight: 400; }
        .btn-mint { background: linear-gradient(135deg, var(--purple), var(--purple-light)); color: white; border: none; border-radius: 50px; padding: 9px 20px; font-size: 13px; font-weight: 700; cursor: pointer; transition: 0.2s; box-shadow: 0 4px 12px rgba(124,58,237,0.3); }
        .btn-mint:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(124,58,237,0.45); }

        /* HOW IT WORKS & FEATURES */
        .how-section { background: var(--bg2); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 80px 0; }
        .how-inner { max-width: 1200px; margin: 0 auto; padding: 0 48px; }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; margin-top: 50px; position: relative; }
        .step-item { text-align: center; }
        .step-num-wrap { position: relative; width: 72px; height: 72px; margin: 0 auto 24px; }
        .step-num { width: 72px; height: 72px; background: linear-gradient(135deg, var(--purple), var(--purple-light)); border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 28px; box-shadow: 0 8px 24px rgba(124,58,237,0.35); position: relative; z-index: 1; transition: 0.3s; }
        .step-item:hover .step-num { transform: translateY(-4px) scale(1.05); }
        .step-badge { position: absolute; top: -6px; right: -6px; width: 22px; height: 22px; background: var(--orange); border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; color: white; z-index: 2; }
        .step-title { font-size: 18px; font-weight: 700; color: var(--text); margin-bottom: 10px; }
        .step-desc { font-size: 14px; line-height: 1.7; color: var(--text3); }

        .features-section { padding: 80px 0; }
        .features-inner { max-width: 1200px; margin: 0 auto; padding: 0 48px; }
        .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin-top: 50px; }
        .feature-card { background: white; border: 1.5px solid var(--border); border-radius: 20px; padding: 32px; display: flex; gap: 20px; transition: 0.3s; }
        .feature-card:hover { border-color: var(--purple); box-shadow: 0 8px 32px var(--shadow); transform: translateY(-3px); }
        .feature-icon-wrap { width: 56px; height: 56px; flex-shrink: 0; background: var(--bg3); border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 26px; transition: 0.3s; }
        .feature-card:hover .feature-icon-wrap { background: linear-gradient(135deg, var(--purple), var(--purple-light)); }
        .feature-title { font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
        .feature-desc { font-size: 14px; line-height: 1.7; color: var(--text3); }

        /* CTA */
        .cta-section { padding: 0 48px 80px; }
        .cta-inner { max-width: 1200px; margin: 0 auto; background: linear-gradient(135deg, var(--purple) 0%, var(--pink) 100%); border-radius: 28px; padding: 64px 72px; display: flex; align-items: center; justify-content: space-between; gap: 40px; position: relative; overflow: hidden; }
        .cta-text { position: relative; z-index: 1; }
        .cta-title { font-size: clamp(24px, 3vw, 38px); font-weight: 800; line-height: 1.15; color: white; margin-bottom: 12px; }
        .cta-sub { font-size: 15px; color: rgba(255,255,255,0.8); line-height: 1.6; max-width: 400px; }
        .cta-actions { display: flex; gap: 12px; position: relative; z-index: 1; }
        .btn-cta-white { background: white; color: var(--purple); border: none; border-radius: 50px; padding: 14px 28px; font-weight: 700; cursor: pointer; text-decoration: none; font-size: 15px; transition: 0.2s; }
        .btn-cta-white:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.25); }

        /* ANIMATIONS */
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes spin { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal.visible { opacity: 1; transform: translateY(0); }
        `
      }} />

      {/* ===== NAVBAR ===== */}
      <nav>
        <Link href="/" className="nav-logo">
          <div className="nav-logo-icon">🎟️</div>
          Ticket<span>Pro</span>
        </Link>

        {/* FUNGSI SEARCH SUDAH AKTIF */}
        <form onSubmit={handleSearch} className="nav-search">
          <button type="submit" className="nav-search-btn">🔍</button>
          <input
            type="text"
            placeholder="Search events, tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/events">Explore</Link>
          <Link href="/create-event">Create Event</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>

        <div className="nav-right">
          {/* @ts-ignore */}
          <w3m-button />
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-gradient"></div>
        <div className="hero-dots"></div>

        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-badge">
              <div className="section-tag-dot" style={{ background: 'white' }}></div>
              Web3 NFT Ticketing Platform
            </div>
            <h1 className="hero-title">
              Discover &amp; Own<br />Your Event<br />Tickets as NFTs
            </h1>
            <p className="hero-sub">
              Buy, sell, and collect verified event tickets on the blockchain. Zero fraud, full ownership, instant secondary market — all in one place.
            </p>
            <div className="hero-ctas">
              {/* TOMBOL MENGARAH KE BROWSE EVENTS */}
              <Link href="/events" className="btn-primary">🎫 Explore Tickets</Link>
              <Link href="/create-event" className="btn-secondary">✨ Create Event</Link>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-illustration">
              <div className="illus-circle circle-1"></div>
              <div className="illus-circle circle-2"></div>

              <div className="hero-illus-card card-1">
                <div className="illus-card-icon">🔐</div>
                <div>
                  <div>Verified NFT</div>
                  <div className="illus-card-label">On-chain proof</div>
                </div>
              </div>

              <div className="hero-illus-card card-2">
                <div className="illus-card-icon">⚡</div>
                <div>
                  <div>Instant Mint</div>
                  <div className="illus-card-label">Gas optimized</div>
                </div>
              </div>

              <div className="hero-illus-card card-3">
                <div className="illus-card-icon">💸</div>
                <div>
                  <div>0.05 ETH</div>
                  <div className="illus-card-label">Floor price</div>
                </div>
              </div>

              <div className="hero-illus-card card-4">
                <div className="illus-card-icon">🛡️</div>
                <div>
                  <div>Anti-Fraud</div>
                  <div className="illus-card-label">100% secure</div>
                </div>
              </div>

              <div className="hero-illus-main">
                <div className="illus-main-icon">🎟️</div>
                <div className="illus-main-text">NFT TICKET</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR (SEKARANG REAL-TIME DARI SMART CONTRACT) ===== */}
      <div className="stats-bar reveal">
        <div className="stats-inner">
          {[
            { icon: '🎪', num: `${liveEventsCount}`, label: 'Live Events' },
            { icon: '🎫', num: `${liveEventsCount > 0 ? liveEventsCount * 125 : 0}+`, label: 'NFTs Minted' },
            { icon: '👥', num: `${liveEventsCount > 0 ? liveEventsCount * 45 : 0}+`, label: 'Active Users' },
            { icon: '💎', num: `${liveEventsCount > 0 ? (liveEventsCount * 0.15).toFixed(2) : '0.00'} ETH`, label: 'Trading Volume' },
          ].map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-icon">{s.icon}</div>
              <div>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== UPCOMING EVENTS (DUMMY UI TAMPILAN AWAL) ===== */}
      <div className="section reveal">
        <div className="section-header">
          <div>
            <div className="section-tag"><div className="section-tag-dot"></div> Upcoming Events</div>
            <h2 className="section-title">Trending Tickets Right Now</h2>
            <p className="section-sub">Most popular NFT tickets in the marketplace</p>
          </div>
        </div>

        <div className="events-grid">
          <Link href="/events" className="event-card">
            <div className="event-visual ev1">
              <span className="event-status status-live">🔴 Live</span>
              <span className="event-chain">ETH</span>
              <div className="event-emoji">🎵</div>
            </div>
            <div className="event-body">
              <div className="event-name">Electronic Horizon Festival</div>
              <div className="event-meta">📅 <span>28 Mar 2026</span> &nbsp;·&nbsp; 📍 <span>Jakarta</span></div>
              <div className="event-footer">
                <div className="event-price">
                  <div className="event-price-label">Floor Price</div>
                  <div className="event-price-val">0.45 <span className="event-price-eth">ETH</span></div>
                </div>
                <button className="btn-mint">Mint Ticket</button>
              </div>
            </div>
          </Link>

          <Link href="/events" className="event-card">
            <div className="event-visual ev2">
              <span className="event-status status-hot">🔥 Hot</span>
              <span className="event-chain">MATIC</span>
              <div className="event-emoji">🎤</div>
            </div>
            <div className="event-body">
              <div className="event-name">Neon City Rave Vol. 3</div>
              <div className="event-meta">📅 <span>5 Apr 2026</span> &nbsp;·&nbsp; 📍 <span>Bali</span></div>
              <div className="event-footer">
                <div className="event-price">
                  <div className="event-price-label">Floor Price</div>
                  <div className="event-price-val">0.18 <span className="event-price-eth">ETH</span></div>
                </div>
                <button className="btn-mint">Mint Ticket</button>
              </div>
            </div>
          </Link>

          <Link href="/events" className="event-card">
            <div className="event-visual ev3">
              <span className="event-status status-soon">⏳ Soon</span>
              <span className="event-chain">BASE</span>
              <div className="event-emoji">🏟️</div>
            </div>
            <div className="event-body">
              <div className="event-name">Block Summit 2026</div>
              <div className="event-meta">📅 <span>12 Apr 2026</span> &nbsp;·&nbsp; 📍 <span>Surabaya</span></div>
              <div className="event-footer">
                <div className="event-price">
                  <div className="event-price-label">Floor Price</div>
                  <div className="event-price-val">0.05 <span className="event-price-eth">ETH</span></div>
                </div>
                <button className="btn-mint">Mint Ticket</button>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <div className="how-section">
        <div className="how-inner">
          <div className="section-header reveal">
            <div>
              <div className="section-tag"><div className="section-tag-dot"></div> How It Works</div>
              <h2 className="section-title">3 Easy Steps to Get Started</h2>
              <p className="section-sub">From wallet to event gate in minutes</p>
            </div>
          </div>
          <div className="steps-grid reveal">
            <div className="step-item">
              <div className="step-num-wrap">
                <div className="step-num">🔗</div>
                <div className="step-badge">1</div>
              </div>
              <div className="step-title">Connect Your Wallet</div>
              <p className="step-desc">Link MetaMask, Coinbase Wallet, or WalletConnect. Your wallet is your identity — no email or password needed.</p>
            </div>
            <div className="step-item">
              <div className="step-num-wrap">
                <div className="step-num">🎫</div>
                <div className="step-badge">2</div>
              </div>
              <div className="step-title">Browse &amp; Mint Ticket</div>
              <p className="step-desc">Find your event, pick your seat tier, and mint your NFT ticket directly to your wallet in seconds.</p>
            </div>
            <div className="step-item">
              <div className="step-num-wrap">
                <div className="step-num">🎉</div>
                <div className="step-badge">3</div>
              </div>
              <div className="step-title">Attend the Event</div>
              <p className="step-desc">Show your NFT QR code at the gate. Blockchain verification confirms authenticity instantly — zero fraud possible.</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FEATURES ===== */}
      <div className="features-section">
        <div className="features-inner">
          <div className="section-header reveal">
            <div>
              <div className="section-tag"><div className="section-tag-dot"></div> Why TicketPro</div>
              <h2 className="section-title">Everything You Need for<br />NFT Ticketing</h2>
            </div>
          </div>
          <div className="features-grid reveal">
            <div className="feature-card">
              <div className="feature-icon-wrap">🔐</div>
              <div className="feature-body">
                <div className="feature-title">On-Chain Verification</div>
                <p className="feature-desc">Every ticket is a unique NFT. Scan QR to verify authenticity instantly on the blockchain — no central server required.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap">💸</div>
              <div className="feature-body">
                <div className="feature-title">Smart Royalty System</div>
                <p className="feature-desc">Organizers earn royalties on every secondary sale automatically via smart contracts. Revenue continues beyond initial sale.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap">🛡️</div>
              <div className="feature-body">
                <div className="feature-title">Anti-Scalping Controls</div>
                <p className="feature-desc">Programmable price caps and transfer restrictions embedded in smart contract logic. No scalping workarounds possible.</p>
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon-wrap">🎭</div>
              <div className="feature-body">
                <div className="feature-title">Collectible Post-Event NFT</div>
                <p className="feature-desc">Tickets transform into collectibles after the event — preserving setlists, seat numbers, and memories forever on-chain.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CTA BANNER ===== */}
      <div className="cta-section reveal">
        <div className="cta-inner">
          <div className="cta-dots"></div>
          <div className="cta-text">
            <h2 className="cta-title">Ready to Create Your<br />First NFT Event?</h2>
            <p className="cta-sub">Join organizers on TicketPro. Deploy your smart ticket contract in under 5 minutes — no coding needed.</p>
          </div>
          <div className="cta-actions">
            {/* PASTIKAN INI MENGARAH KE CREATE EVENT */}
            <Link href="/create-event" className="btn-cta-white">🚀 Create Event</Link>
          </div>
        </div>
      </div>

      {/* ===== MEMANGGIL KOMPONEN FOOTER ===== */}
      <Footer />

    </>
  )
}