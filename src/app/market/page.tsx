'use client'

import Link from 'next/link'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// --- DATA DUMMY DARI HTML KAMU ---
const browseEvents = [
    { id: 1, name: "Electronic Horizon Festival", org: "HorizonDAO", date: "28 Mar 2026", city: "Jakarta", tags: ["Music", "EDM", "Festival"], sold: 850, total: 1000, price: "0.45", usd: "1,620", bgClass: "ev1", emoji: "🎵", status: "🔴 Live", statusClass: "status-live", chain: "ETH" },
    { id: 2, name: "Neon City Rave Vol. 3", org: "NeonCollective", date: "5 Apr 2026", city: "Bali", tags: ["Rave", "Techno"], sold: 620, total: 800, price: "0.18", usd: "648", bgClass: "ev2", emoji: "🎤", status: "🔥 Hot", statusClass: "status-hot", chain: "MATIC" },
    { id: 3, name: "Block Summit 2026", org: "BlockDAO", date: "12 Apr 2026", city: "Surabaya", tags: ["Web3", "Conference"], sold: 310, total: 2000, price: "0.05", usd: "180", bgClass: "ev3", emoji: "💻", status: "⏳ Soon", statusClass: "status-soon", chain: "BASE" },
    { id: 4, name: "Metamorphosis Art Fair", org: "ArtOnChain", date: "19 Apr 2026", city: "Bandung", tags: ["Art", "Exhibition"], sold: 450, total: 600, price: "0.30", usd: "1,080", bgClass: "ev4", emoji: "🎨", status: "🔴 Live", statusClass: "status-live", chain: "ETH" },
    { id: 5, name: "Web3 Culture Festival", org: "CultureDAO", date: "25 Apr 2026", city: "Yogyakarta", tags: ["Culture", "Web3"], sold: 980, total: 1500, price: "0.22", usd: "792", bgClass: "ev5", emoji: "🎭", status: "🔥 Hot", statusClass: "status-hot", chain: "MATIC" },
    { id: 6, name: "DeFi Launchpad Night", org: "DeFiGuild", date: "2 Mei 2026", city: "Jakarta", tags: ["DeFi", "Networking"], sold: 200, total: 500, price: "0.12", usd: "432", bgClass: "ev6", emoji: "🚀", status: "⏳ Soon", statusClass: "status-soon", chain: "BASE" },
    { id: 7, name: "NFT Gaming Championship", org: "GameFiDAO", date: "10 Mei 2026", city: "Jakarta", tags: ["Gaming", "Esports"], sold: 750, total: 800, price: "0.08", usd: "288", bgClass: "ev7", emoji: "🏆", status: "🔥 Hot", statusClass: "status-hot", chain: "ETH" },
    { id: 8, name: "Green Crypto Summit", org: "EcoWeb3", date: "18 Mei 2026", city: "Bali", tags: ["Sustainability", "Web3"], sold: 120, total: 400, price: "0.06", usd: "216", bgClass: "ev8", emoji: "🌿", status: "⏳ Soon", statusClass: "status-soon", chain: "MATIC" },
    { id: 9, name: "Web3 Film Premiere", org: "CinemaDAO", date: "22 Mei 2026", city: "Jakarta", tags: ["Film", "Entertainment"], sold: 180, total: 250, price: "0.15", usd: "540", bgClass: "ev9", emoji: "🎬", status: "🔴 Live", statusClass: "status-live", chain: "ETH" },
]

export default function BrowsePage() {
    const [view, setView] = useState<'grid' | 'list'>('grid')
    const [wishlist, setWishlist] = useState<number[]>([2, 5]) // Default yang di-like

    const toggleWish = (id: number) => {
        if (wishlist.includes(id)) {
            setWishlist(wishlist.filter(w => w !== id))
        } else {
            setWishlist([...wishlist, id])
        }
    }

    return (
        <main className="browse-wrapper">
            <style dangerouslySetInnerHTML={{
                __html: `
        .browse-wrapper {
          --purple: #7C3AED; --purple-light: #A855F7; --pink: #EC4899;
          --bg2: #FAFAFF; --bg3: #F3F0FF; --text: #0F0A1E; --text2: #4B4869;
          --text3: #9896B0; --border: #E8E4F5; --shadow: rgba(124, 58, 237, 0.10);
          background: var(--bg2); color: var(--text); font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .page-header { background: linear-gradient(135deg, var(--purple) 0%, var(--purple-light) 60%, var(--pink) 100%); padding: 48px; position: relative; overflow: hidden; }
        .page-header::before { content: ''; position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.12) 1.5px, transparent 1.5px); background-size: 24px 24px; }
        .page-header-inner { max-width: 1300px; margin: 0 auto; position: relative; z-index: 1; }
        .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(255,255,255,0.7); margin-bottom: 14px; }
        .breadcrumb a { color: rgba(255,255,255,0.7); text-decoration: none; transition: color 0.2s; }
        .breadcrumb a:hover { color: white; }
        .breadcrumb-sep { opacity: 0.5; }
        .breadcrumb-current { color: white; font-weight: 600; }
        .page-header h1 { font-size: clamp(28px, 4vw, 42px); font-weight: 800; color: white; letter-spacing: -0.02em; margin-bottom: 8px; }
        .page-header-sub { font-size: 15px; color: rgba(255,255,255,0.8); display: flex; align-items: center; gap: 16px; }
        .result-badge { background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 50px; padding: 3px 12px; font-size: 13px; font-weight: 600; color: white; backdrop-filter: blur(8px); }

        .main-layout { max-width: 1300px; margin: 0 auto; padding: 32px 48px 80px; display: grid; grid-template-columns: 280px 1fr; gap: 28px; align-items: start; }
        
        .sidebar { background: white; border: 1px solid var(--border); border-radius: 20px; position: sticky; top: 88px; }
        .sidebar-header { padding: 20px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
        .sidebar-title { font-size: 15px; font-weight: 700; color: var(--text); }
        .btn-clear { font-size: 12px; font-weight: 600; color: var(--purple); background: none; border: none; cursor: pointer; }
        .filter-group { padding: 20px 24px; border-bottom: 1px solid var(--border); }
        .filter-group-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; cursor: pointer; }
        .filter-group-title { font-size: 13px; font-weight: 700; color: var(--text); text-transform: uppercase; letter-spacing: 0.06em; }
        
        .cat-tag { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; border-radius: 50px; border: 1.5px solid var(--border); font-size: 12px; font-weight: 600; color: var(--text2); cursor: pointer; transition: all 0.2s; background: white; margin-right: 8px; margin-bottom: 8px; }
        .cat-tag:hover, .cat-tag.active { border-color: var(--purple); color: var(--purple); background: var(--bg3); }
        .filter-option { display: flex; align-items: center; justify-content: space-between; padding: 6px 0; cursor: pointer; }
        .checkbox { width: 18px; height: 18px; border: 2px solid var(--border); border-radius: 5px; display: flex; align-items: center; justify-content: center; }
        .checkbox.checked { background: var(--purple); border-color: var(--purple); color: white; font-size: 11px; }
        
        .sort-bar { background: white; border: 1px solid var(--border); border-radius: 14px; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .view-btn { width: 34px; height: 34px; border: 1px solid var(--border); border-radius: 8px; background: white; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px; color: var(--text3); }
        .view-btn.active { background: var(--bg3); border-color: var(--purple); color: var(--purple); }

        .events-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 32px; }
        .events-grid.list-view { grid-template-columns: 1fr; }
        .event-card { background: white; border: 1px solid var(--border); border-radius: 18px; overflow: hidden; transition: transform 0.3s, box-shadow 0.3s; cursor: pointer; position: relative; }
        .event-card:hover { transform: translateY(-5px); box-shadow: 0 16px 48px var(--shadow); border-color: rgba(124,58,237,0.2); }
        
        .event-visual { height: 160px; position: relative; display: flex; align-items: center; justify-content: center; }
        .ev1 { background: linear-gradient(135deg, #667EEA, #764BA2); } .ev2 { background: linear-gradient(135deg, #F093FB, #F5576C); } .ev3 { background: linear-gradient(135deg, #4FACFE, #00F2FE); } .ev4 { background: linear-gradient(135deg, #43E97B, #38F9D7); } .ev5 { background: linear-gradient(135deg, #FA709A, #FEE140); } .ev6 { background: linear-gradient(135deg, #A18CD1, #FBC2EB); } .ev7 { background: linear-gradient(135deg, #f7971e, #ffd200); } .ev8 { background: linear-gradient(135deg, #11998e, #38ef7d); } .ev9 { background: linear-gradient(135deg, #ee0979, #ff6a00); }
        
        .event-emoji { font-size: 56px; filter: drop-shadow(0 6px 12px rgba(0,0,0,0.2)); }
        .event-status { position: absolute; top: 12px; left: 12px; font-size: 11px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 50px; }
        .status-live { background: #DCFCE7; color: #16A34A; } .status-soon { background: #FEF3C7; color: #D97706; } .status-hot { background: #FEE2E2; color: #DC2626; }
        .event-chain { position: absolute; top: 12px; right: 12px; background: rgba(255,255,255,0.92); border-radius: 50px; padding: 3px 10px; font-size: 11px; font-weight: 700; color: var(--purple); }
        .event-wishlist { position: absolute; bottom: 12px; right: 12px; width: 32px; height: 32px; background: rgba(255,255,255,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; transition: transform 0.2s; backdrop-filter: blur(8px); }
        .event-wishlist.liked { background: #FEE2E2; }
        
        .event-body { padding: 18px; }
        .event-name { font-size: 15px; font-weight: 700; margin-bottom: 5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .event-org { font-size: 12px; color: var(--purple); font-weight: 600; margin-bottom: 10px; }
        .event-tags { display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }
        .event-tag { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 50px; background: var(--bg3); color: var(--purple); }
        
        .supply-label { display: flex; justify-content: space-between; font-size: 11px; color: var(--text3); margin-bottom: 5px; font-weight: 500; }
        .supply-track { height: 5px; background: var(--bg3); border-radius: 99px; overflow: hidden; }
        .supply-fill { height: 100%; background: linear-gradient(90deg, var(--purple), var(--purple-light)); }
        
        .event-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 14px; margin-top: 14px; }
        .event-price-val { font-size: 18px; font-weight: 800; color: var(--purple); }
        .btn-mint { background: linear-gradient(135deg, var(--purple), var(--purple-light)); color: white; border: none; border-radius: 50px; padding: 9px 18px; font-weight: 700; cursor: pointer; }
        
        .events-grid.list-view .event-card { display: flex; flex-direction: row; }
        .events-grid.list-view .event-visual { width: 180px; height: auto; flex-shrink: 0; }
        .events-grid.list-view .event-body { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
        
        @media (max-width: 900px) {
          .main-layout { grid-template-columns: 1fr; padding: 20px; }
          .sidebar { display: none; } /* Sidebar disembunyikan di HP untuk sementara */
          .events-grid { grid-template-columns: 1fr; }
        }
      `}} />

            <Navbar />

            <div className="page-header">
                <div className="page-header-inner">
                    <div className="breadcrumb">
                        <Link href="/">Home</Link> <span className="breadcrumb-sep">/</span> <span className="breadcrumb-current">Browse Events</span>
                    </div>
                    <h1>Browse All Events 🎪</h1>
                    <div className="page-header-sub">
                        Discover NFT tickets from hundreds of events worldwide
                        <span className="result-badge">2,418 Events Found</span>
                    </div>
                </div>
            </div>

            <div className="main-layout">

                {/* SIDEBAR FILTER */}
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <div className="sidebar-title">🎛️ Filters</div>
                        <button className="btn-clear">Clear All</button>
                    </div>

                    <div className="filter-group">
                        <div className="filter-group-header">
                            <div className="filter-group-title">Category</div>
                        </div>
                        <div>
                            <div className="cat-tag active">🎵 Music</div>
                            <div className="cat-tag">🎨 Art</div>
                            <div className="cat-tag">🏟️ Sports</div>
                            <div className="cat-tag">💻 Tech</div>
                            <div className="cat-tag">🎭 Theater</div>
                        </div>
                    </div>

                    <div className="filter-group">
                        <div className="filter-group-header">
                            <div className="filter-group-title">Blockchain</div>
                        </div>
                        <div className="filter-option"><div style={{ display: 'flex', gap: '10px' }}><div className="checkbox checked">✓</div> <span style={{ fontSize: '13px', fontWeight: 500 }}>Ethereum</span></div><span style={{ fontSize: '11px', color: '#9896B0' }}>842</span></div>
                        <div className="filter-option"><div style={{ display: 'flex', gap: '10px' }}><div className="checkbox checked">✓</div> <span style={{ fontSize: '13px', fontWeight: 500 }}>Polygon</span></div><span style={{ fontSize: '11px', color: '#9896B0' }}>1,204</span></div>
                        <div className="filter-option"><div style={{ display: 'flex', gap: '10px' }}><div className="checkbox"></div> <span style={{ fontSize: '13px', fontWeight: 500 }}>Base</span></div><span style={{ fontSize: '11px', color: '#9896B0' }}>372</span></div>
                    </div>

                    <div className="filter-group">
                        <button style={{ width: '100%', padding: '11px', background: 'linear-gradient(135deg, #7C3AED, #A855F7)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Apply Filters</button>
                    </div>
                </aside>

                {/* CONTENT */}
                <div className="content-area">
                    <div className="sort-bar">
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: '#9896B0' }}>Sort by:</span>
                            <select style={{ border: '1px solid #E8E4F5', borderRadius: '8px', padding: '6px 10px', fontSize: '13px', fontWeight: 600, outline: 'none' }}>
                                <option>Most Popular</option>
                                <option>Price: Low to High</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: '#9896B0' }}><strong>2,418</strong> events</span>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button className={`view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>⊞</button>
                                <button className={`view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>☰</button>
                            </div>
                        </div>
                    </div>

                    <div className={`events-grid ${view === 'list' ? 'list-view' : ''}`}>
                        {browseEvents.map((ev) => (
                            <div key={ev.id} className="event-card">
                                <div className={`event-visual ${ev.bgClass}`}>
                                    <span className={`event-status ${ev.statusClass}`}>{ev.status}</span>
                                    <span className="event-chain">{ev.chain}</span>
                                    <div className="event-emoji">{ev.emoji}</div>
                                    <div
                                        className={`event-wishlist ${wishlist.includes(ev.id) ? 'liked' : ''}`}
                                        onClick={(e) => { e.preventDefault(); toggleWish(ev.id); }}
                                    >
                                        {wishlist.includes(ev.id) ? '❤️' : '🤍'}
                                    </div>
                                </div>
                                <div className="event-body">
                                    <div className="event-name">{ev.name}</div>
                                    <div className="event-org">by {ev.org}</div>
                                    <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#9896B0', fontWeight: 500, marginBottom: '14px' }}>
                                        <span>📅 {ev.date}</span><span>📍 {ev.city}</span>
                                    </div>
                                    <div className="event-tags">
                                        {ev.tags.map(tag => <span key={tag} className="event-tag">{tag}</span>)}
                                    </div>
                                    <div className="supply-bar">
                                        <div className="supply-label"><span>Tickets Sold</span><span><span style={{ color: '#0F0A1E' }}>{ev.sold}</span> / {ev.total}</span></div>
                                        <div className="supply-track"><div className="supply-fill" style={{ width: `${(ev.sold / ev.total) * 100}%` }}></div></div>
                                    </div>
                                    <div className="event-footer">
                                        <div>
                                            <div style={{ fontSize: '11px', color: '#9896B0' }}>Floor Price</div>
                                            <div className="event-price-val">{ev.price} ETH</div>
                                            <div style={{ fontSize: '11px', color: '#9896B0' }}>≈ ${ev.usd}</div>
                                        </div>
                                        <Link href={`/events/${ev.id}`}>
                                            <button className="btn-mint">Mint Ticket</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}