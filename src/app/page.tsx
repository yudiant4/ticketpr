'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'

const events = [
  { id: 1, emoji: '🎵', name: 'Electronic Horizon Festival', org: 'HorizonDAO', date: '28 Mar 2026', city: 'Jakarta', price: '0.45', usd: '1,620', status: 'live', chain: 'ETH', bg: 'linear-gradient(135deg,#667EEA,#764BA2)', tags: ['Music','EDM'], sold: 850, total: 1000 },
  { id: 2, emoji: '🎤', name: 'Neon City Rave Vol. 3', org: 'NeonCollective', date: '5 Apr 2026', city: 'Bali', price: '0.18', usd: '648', status: 'hot', chain: 'MATIC', bg: 'linear-gradient(135deg,#F093FB,#F5576C)', tags: ['Rave','Techno'], sold: 620, total: 800 },
  { id: 3, emoji: '💻', name: 'Block Summit 2026', org: 'BlockDAO', date: '12 Apr 2026', city: 'Surabaya', price: '0.05', usd: '180', status: 'soon', chain: 'BASE', bg: 'linear-gradient(135deg,#4FACFE,#00F2FE)', tags: ['Web3','Conference'], sold: 310, total: 2000 },
  { id: 4, emoji: '🎨', name: 'Metamorphosis Art Fair', org: 'ArtOnChain', date: '19 Apr 2026', city: 'Bandung', price: '0.30', usd: '1,080', status: 'live', chain: 'ETH', bg: 'linear-gradient(135deg,#43E97B,#38F9D7)', tags: ['Art','Exhibition'], sold: 450, total: 600 },
  { id: 5, emoji: '🎭', name: 'Web3 Culture Festival', org: 'CultureDAO', date: '25 Apr 2026', city: 'Yogyakarta', price: '0.22', usd: '792', status: 'hot', chain: 'MATIC', bg: 'linear-gradient(135deg,#FA709A,#FEE140)', tags: ['Culture','Web3'], sold: 980, total: 1500 },
  { id: 6, emoji: '🚀', name: 'DeFi Launchpad Night', org: 'DeFiGuild', date: '2 Mei 2026', city: 'Jakarta', price: '0.12', usd: '432', status: 'soon', chain: 'BASE', bg: 'linear-gradient(135deg,#A18CD1,#FBC2EB)', tags: ['DeFi','Networking'], sold: 200, total: 500 },
  { id: 7, emoji: '🏆', name: 'NFT Gaming Championship', org: 'GameFiDAO', date: '10 Mei 2026', city: 'Jakarta', price: '0.08', usd: '288', status: 'hot', chain: 'ETH', bg: 'linear-gradient(135deg,#f7971e,#ffd200)', tags: ['Gaming','Esports'], sold: 750, total: 800 },
  { id: 8, emoji: '🌿', name: 'Green Crypto Summit', org: 'EcoWeb3', date: '18 Mei 2026', city: 'Bali', price: '0.06', usd: '216', status: 'soon', chain: 'MATIC', bg: 'linear-gradient(135deg,#11998e,#38ef7d)', tags: ['Sustainability','Web3'], sold: 120, total: 400 },
  { id: 9, emoji: '🎬', name: 'Web3 Film Premiere', org: 'CinemaDAO', date: '22 Mei 2026', city: 'Jakarta', price: '0.15', usd: '540', status: 'live', chain: 'ETH', bg: 'linear-gradient(135deg,#ee0979,#ff6a00)', tags: ['Film','Entertainment'], sold: 180, total: 250 },
]

const statusLabel: Record<string, string> = {
  live: '🔴 Live', hot: '🔥 Hot', soon: '⏳ Soon'
}

export default function EventsPage() {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('popular')
  const [activeFilter, setActiveFilter] = useState('all')
  const [wishlist, setWishlist] = useState<number[]>([2, 5])

  const filtered = events.filter(ev => {
    const matchSearch = ev.name.toLowerCase().includes(search.toLowerCase())
    const matchFilter = activeFilter === 'all' || ev.status === activeFilter
    return matchSearch && matchFilter
  })

  const toggleWish = (id: number) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(w => w !== id) : [...prev, id])
  }

  return (
    <main style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', background: '#FAFAFF', color: '#0F0A1E' }}>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0 48px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #E8E4F5' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '20px', color: '#0F0A1E', textDecoration: 'none' }}>
          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🎟️</div>
          Ticket<span style={{ color: '#7C3AED' }}>Pro</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FAFAFF', border: '1px solid #E8E4F5', borderRadius: '50px', padding: '8px 16px', width: '280px' }}>
          <span style={{ color: '#9896B0', fontSize: '14px' }}>🔍</span>
          <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', background: 'none', fontSize: '13px', color: '#0F0A1E', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link href="/create-event" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Create Event</Link>
          <Link href="/market" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Market</Link>
          <Link href="/verify" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Verify</Link>
        </div>
        <ConnectButton />
      </nav>

      {/* PAGE HEADER */}
      <div style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7,#EC4899)', padding: '48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.12) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
        <div style={{ maxWidth: '1300px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '14px' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Home</Link>
            <span>/</span>
            <span style={{ color: 'white', fontWeight: 600 }}>Browse Events</span>
          </div>
          <h1 style={{ fontSize: 'clamp(28px,4vw,42px)', fontWeight: 800, color: 'white', marginBottom: '8px' }}>Browse All Events 🎪</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '15px', color: 'rgba(255,255,255,0.8)' }}>
            Discover NFT tickets from hundreds of events worldwide
            <span style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50px', padding: '3px 12px', fontSize: '13px', fontWeight: 600, color: 'white' }}>
              {filtered.length} Events Found
            </span>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '32px 48px 80px', display: 'grid', gridTemplateColumns: '260px 1fr', gap: '28px', alignItems: 'start' }}>

        {/* SIDEBAR */}
        <aside style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '20px', overflow: 'hidden', position: 'sticky', top: '88px' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8E4F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '15px', fontWeight: 700 }}>🎛️ Filters</div>
            <button onClick={() => setActiveFilter('all')} style={{ fontSize: '12px', fontWeight: 600, color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer' }}>Clear All</button>
          </div>

          {/* Category */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8E4F5' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F0A1E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>Category</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['🎵 Music', '🎨 Art', '🏟️ Sports', '💻 Tech', '🎭 Theater', '🕹️ Gaming', '🚀 Web3'].map((cat, i) => (
                <div key={i} style={{ padding: '6px 12px', borderRadius: '50px', border: '1.5px solid #E8E4F5', fontSize: '12px', fontWeight: 600, color: '#4B4869', cursor: 'pointer', background: 'white' }}>{cat}</div>
              ))}
            </div>
          </div>

          {/* Status */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8E4F5' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F0A1E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>Status</div>
            {[
              { val: 'all', label: 'All Events', count: events.length },
              { val: 'live', label: '🔴 Live Now', count: events.filter(e => e.status === 'live').length },
              { val: 'hot', label: '🔥 Trending', count: events.filter(e => e.status === 'hot').length },
              { val: 'soon', label: '⏳ Coming Soon', count: events.filter(e => e.status === 'soon').length },
            ].map((s, i) => (
              <div key={i} onClick={() => setActiveFilter(s.val)}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '5px', border: `2px solid ${activeFilter === s.val ? '#7C3AED' : '#E8E4F5'}`, background: activeFilter === s.val ? '#7C3AED' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '11px' }}>
                    {activeFilter === s.val ? '✓' : ''}
                  </div>
                  <span style={{ fontSize: '13px', color: '#4B4869', fontWeight: 500 }}>{s.label}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#9896B0', background: '#FAFAFF', borderRadius: '50px', padding: '2px 8px', fontWeight: 600 }}>{s.count}</span>
              </div>
            ))}
          </div>

          {/* Blockchain */}
          <div style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F0A1E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>Blockchain</div>
            {[
              { label: 'Ethereum', count: 842 },
              { label: 'Polygon', count: 1204 },
              { label: 'Base', count: 372 },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '5px', border: '2px solid #E8E4F5', background: 'white' }} />
                  <span style={{ fontSize: '13px', color: '#4B4869', fontWeight: 500 }}>{b.label}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#9896B0', background: '#FAFAFF', borderRadius: '50px', padding: '2px 8px', fontWeight: 600 }}>{b.count}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* CONTENT */}
        <div>
          {/* Sort Bar */}
          <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '14px', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: '#9896B0', fontWeight: 500 }}>Sort by:</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ border: '1px solid #E8E4F5', borderRadius: '8px', padding: '6px 10px', fontSize: '13px', color: '#0F0A1E', fontWeight: 600, background: '#FAFAFF', outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}>
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="date">Date: Nearest</option>
              </select>
            </div>
            <span style={{ fontSize: '13px', color: '#9896B0' }}>
              <strong style={{ color: '#0F0A1E' }}>{filtered.length}</strong> events found
            </span>
          </div>

          {/* Events Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px', marginBottom: '32px' }}>
            {filtered.map((ev) => (
              <div key={ev.id} style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '18px', overflow: 'hidden', transition: 'transform 0.3s' }}>
                <div style={{ height: '160px', background: ev.bg, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '52px', filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.2))' }}>{ev.emoji}</span>
                  <span style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '50px', background: 'rgba(255,255,255,0.9)', color: '#0F0A1E' }}>{statusLabel[ev.status]}</span>
                  <span style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '50px', background: 'rgba(255,255,255,0.9)', color: '#7C3AED' }}>{ev.chain}</span>
                  <button onClick={() => toggleWish(ev.id)} style={{ position: 'absolute', bottom: '12px', right: '12px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {wishlist.includes(ev.id) ? '❤️' : '🤍'}
                  </button>
                </div>
                <div style={{ padding: '18px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F0A1E', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.name}</div>
                  <div style={{ fontSize: '12px', color: '#7C3AED', fontWeight: 600, marginBottom: '8px' }}>by {ev.org}</div>
                  <div style={{ fontSize: '12px', color: '#9896B0', marginBottom: '10px' }}>📅 {ev.date} · 📍 {ev.city}</div>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    {ev.tags.map((tag, i) => (
                      <span key={i} style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '50px', background: '#F3F0FF', color: '#7C3AED' }}>{tag}</span>
                    ))}
                  </div>
                  {/* Supply bar */}
                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9896B0', marginBottom: '5px' }}>
                      <span>Tickets Sold</span>
                      <span style={{ fontWeight: 700, color: '#0F0A1E' }}>{ev.sold} / {ev.total}</span>
                    </div>
                    <div style={{ height: '5px', background: '#F3F0FF', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg,#7C3AED,#A855F7)', width: `${Math.round(ev.sold/ev.total*100)}%` }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #E8E4F5', paddingTop: '14px' }}>
                    <div>
                      <div style={{ fontSize: '11px', color: '#9896B0' }}>Floor Price</div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#7C3AED' }}>{ev.price} ETH</div>
                      <div style={{ fontSize: '11px', color: '#9896B0' }}>≈ ${ev.usd}</div>
                    </div>
                    <Link href={`/ticket/${ev.id}`} style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: 'white', border: 'none', borderRadius: '50px', padding: '9px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', textDecoration: 'none' }}>
                      Mint Ticket
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            {[1, 2, 3, 4].map((p) => (
              <button key={p} style={{ width: '38px', height: '38px', borderRadius: '10px', border: `1px solid ${p === 1 ? '#7C3AED' : '#E8E4F5'}`, background: p === 1 ? '#7C3AED' : 'white', color: p === 1 ? 'white' : '#4B4869', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{p}</button>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#0F0A1E', color: 'white', padding: '40px 48px 24px' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '18px' }}>
            <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🎟️</div>
            TicketPro
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>© 2026 TicketPro. All rights reserved.</div>
        </div>
      </footer>

    </main>
  )
}
