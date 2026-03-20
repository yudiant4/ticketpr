'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'

const tickets = [
  { id: 1, emoji: '🎵', name: 'Electronic Horizon Festival', date: '28 Mar 2026', city: 'Jakarta', tier: 'GA #0042', status: 'live', price: '0.45', usd: '1,620', bg: 'linear-gradient(135deg,#667EEA,#764BA2)' },
  { id: 2, emoji: '🎤', name: 'Neon City Rave Vol. 3', date: '5 Apr 2026', city: 'Bali', tier: 'VIP #0018', status: 'upcoming', price: '0.90', usd: '3,240', bg: 'linear-gradient(135deg,#F093FB,#F5576C)' },
  { id: 3, emoji: '💻', name: 'Block Summit 2026', date: '12 Apr 2026', city: 'Surabaya', tier: 'Listed 0.08 ETH', status: 'listed', price: '0.05', usd: '180', bg: 'linear-gradient(135deg,#4FACFE,#00F2FE)' },
  { id: 4, emoji: '🎨', name: 'Metamorphosis Art Fair', date: '19 Apr 2026', city: 'Bandung', tier: 'GA #0220', status: 'upcoming', price: '0.30', usd: '1,080', bg: 'linear-gradient(135deg,#43E97B,#38F9D7)' },
  { id: 5, emoji: '🎭', name: 'Web3 Culture Festival', date: '15 Jan 2026', city: 'Yogyakarta', tier: 'Used', status: 'used', price: '0.22', usd: '792', bg: 'linear-gradient(135deg,#FA709A,#FEE140)' },
]

const activities = [
  { icon: '🎫', bg: '#DCFCE7', action: 'Minted', name: 'EHF Ticket #0042', time: '2 hours ago', amount: '−0.45 ETH', positive: false },
  { icon: '💸', bg: '#FEF3C7', action: 'Sold', name: 'Block Summit GA #0310', time: '1 day ago', amount: '+0.08 ETH', positive: true },
  { icon: '🎁', bg: '#F3F0FF', action: 'Royalty from', name: 'Neon Rave #0091', time: '3 days ago', amount: '+0.009 ETH', positive: true },
  { icon: '🏷️', bg: '#EFF6FF', action: 'Listed', name: 'Block Summit #0042', time: '3 days ago', amount: '—', positive: null },
  { icon: '🎫', bg: '#DCFCE7', action: 'Minted', name: 'Neon City VIP #0018', time: '5 days ago', amount: '−0.90 ETH', positive: false },
]

const chartData = {
  '7D': [
    { label: 'Mon', val: 0.08 }, { label: 'Tue', val: 0.12 }, { label: 'Wed', val: 0.05 },
    { label: 'Thu', val: 0.20 }, { label: 'Fri', val: 0.15 }, { label: 'Sat', val: 0.30 }, { label: 'Sun', val: 0.18 },
  ],
  '1M': [
    { label: 'W1', val: 0.25 }, { label: 'W2', val: 0.40 }, { label: 'W3', val: 0.15 }, { label: 'W4', val: 0.55 },
  ],
  '3M': [
    { label: 'Jan', val: 0.80 }, { label: 'Feb', val: 1.20 }, { label: 'Mar', val: 0.45 },
  ],
}

const statusLabel: Record<string, { label: string, color: string, bg: string }> = {
  live:     { label: '🔴 Today',    color: '#16A34A', bg: '#DCFCE7' },
  upcoming: { label: '⏳ Upcoming', color: '#2563EB', bg: '#EFF6FF' },
  listed:   { label: '🏷️ Listed',   color: '#D97706', bg: '#FEF3C7' },
  used:     { label: '✅ Used',     color: '#9896B0', bg: '#F3F4F6' },
}

interface MenuItem {
  icon: string
  label: string
  href: string
  active?: boolean
  badge?: string
  badgeNew?: string
}

interface MenuSection {
  section: string
  items: MenuItem[]
}

const menuItems: MenuSection[] = [
  {
    section: 'Main', items: [
      { icon: '🏠', label: 'Dashboard', href: '/dashboard', active: true },
      { icon: '🔍', label: 'Explore Events', href: '/events' },
      { icon: '🎫', label: 'My Tickets', href: '#', badge: '5' },
      { icon: '🛒', label: 'Marketplace', href: '#' },
    ]
  },
  {
    section: 'Manage', items: [
      { icon: '📅', label: 'My Events', href: '#', badge: '2' },
      { icon: '💰', label: 'Earnings', href: '#' },
      { icon: '🔔', label: 'Notifications', href: '#', badgeNew: '3' },
      { icon: '🤍', label: 'Wishlist', href: '#', badge: '8' },
    ]
  },
  {
    section: 'Account', items: [
      { icon: '👤', label: 'Profile', href: '#' },
      { icon: '💎', label: 'Wallet', href: '#' },
      { icon: '⚙️', label: 'Settings', href: '#' },
    ]
  },
]

export default function Dashboard() {
  const [ticketFilter, setTicketFilter] = useState('all')
  const [chartPeriod, setChartPeriod] = useState('7D')
  const [toast, setToast] = useState('')
  const [wishlist, setWishlist] = useState(false)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const filteredTickets = tickets.filter(t =>
    ticketFilter === 'all' ? true : t.status === ticketFilter
  )

  const data = chartData[chartPeriod as keyof typeof chartData]
  const maxVal = Math.max(...data.map(d => d.val))

  return (
    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', display: 'flex', minHeight: '100vh', background: '#FAFAFF', color: '#0F0A1E' }}>

      {/* SIDEBAR */}
      <aside style={{ width: '260px', flexShrink: 0, background: 'white', borderRight: '1px solid #E8E4F5', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, overflowY: 'auto' }}>
        <Link href="/" style={{ padding: '28px 24px 20px', borderBottom: '1px solid #E8E4F5', display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🎟️</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F0A1E' }}>Ticket<span style={{ color: '#7C3AED' }}>Pro</span></div>
        </Link>

        {/* Profile */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8E4F5', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>😎</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F0A1E' }}>CryptoFan.eth</div>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#7C3AED' }}>0x3f2A...9B4c</div>
          </div>
          <div style={{ background: '#DCFCE7', color: '#16A34A', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '50px', flexShrink: 0 }}>● Online</div>
        </div>

        {/* Menu */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {menuItems.map((section, si) => (
            <div key={si}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#9896B0', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0 12px', marginBottom: '6px', marginTop: si > 0 ? '16px' : '0' }}>{section.section}</div>
              {section.items.map((item, ii) => (
                <Link key={ii} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: item.active ? '#7C3AED' : '#4B4869', background: item.active ? '#F3F0FF' : 'transparent', textDecoration: 'none', marginBottom: '2px', position: 'relative' }}>
                  {item.active && <div style={{ position: 'absolute', left: 0, top: '6px', bottom: '6px', width: '3px', background: '#7C3AED', borderRadius: '0 3px 3px 0' }} />}
                  <span style={{ fontSize: '18px', width: '22px', textAlign: 'center' }}>{item.icon}</span>
                  {item.label}
                  {item.badge && <span style={{ marginLeft: 'auto', background: '#7C3AED', color: 'white', fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '50px' }}>{item.badge}</span>}
                  {item.badgeNew && <span style={{ marginLeft: 'auto', background: '#F97316', color: 'white', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '50px' }}>{item.badgeNew}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid #E8E4F5' }}>
          <button onClick={() => showToast('👋 Disconnected!')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontFamily: 'inherit' }}>
            <span style={{ fontSize: '18px' }}>🚪</span> Disconnect
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* TOPBAR */}
        <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #E8E4F5', padding: '0 36px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F0A1E' }}>👋 Welcome back, CryptoFan!</div>
            <div style={{ fontSize: '12px', color: '#9896B0', marginTop: '1px' }}>Saturday, 21 March 2026 · Ethereum Mainnet</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FAFAFF', border: '1px solid #E8E4F5', borderRadius: '50px', padding: '8px 16px', width: '220px' }}>
              <span style={{ color: '#9896B0', fontSize: '14px' }}>🔍</span>
              <input type="text" placeholder="Search tickets..." style={{ border: 'none', background: 'none', fontSize: '13px', color: '#0F0A1E', outline: 'none', width: '100%', fontFamily: 'inherit' }} />
            </div>
            <button onClick={() => showToast('🔔 You have 3 new notifications!')} style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid #E8E4F5', background: 'white', fontSize: '16px', cursor: 'pointer', position: 'relative' }}>
              🔔
              <div style={{ position: 'absolute', top: '7px', right: '7px', width: '8px', height: '8px', borderRadius: '50%', background: '#F97316', border: '2px solid white' }} />
            </button>
            <ConnectButton />
          </div>
        </div>

        {/* PAGE BODY */}
        <div style={{ padding: '32px 36px 80px' }}>

          {/* OVERVIEW CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px', marginBottom: '28px' }}>
            {[
              { icon: '🎫', iconBg: '#F3F0FF', num: '5', label: 'My Tickets', sub: '3 upcoming · 2 used', trend: '↑ +2', trendUp: true },
              { icon: '💰', iconBg: '#DCFCE7', num: '2.84 ETH', label: 'Wallet Balance', sub: '≈ $10,224', trend: '↑ +12%', trendUp: true },
              { icon: '📈', iconBg: '#FFF7ED', num: '1.20 ETH', label: 'Total Earnings', sub: 'From secondary sales', trend: '↑ +8%', trendUp: true },
              { icon: '🤍', iconBg: '#EFF6FF', num: '8', label: 'Wishlist', sub: '2 going live soon', trend: '↓ -1', trendUp: false },
            ].map((card, i) => (
              <div key={i} style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '18px', padding: '22px', transition: 'transform 0.3s' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>{card.icon}</div>
                  <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '50px', background: card.trendUp ? '#DCFCE7' : '#FEE2E2', color: card.trendUp ? '#16A34A' : '#DC2626' }}>{card.trend}</span>
                </div>
                <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F0A1E', lineHeight: 1, marginBottom: '5px' }}>{card.num}</div>
                <div style={{ fontSize: '13px', color: '#9896B0', fontWeight: 500 }}>{card.label}</div>
                <div style={{ fontSize: '11px', color: '#9896B0', marginTop: '6px' }}>{card.sub}</div>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
            {[
              { icon: '🛒', label: 'Buy Ticket', sub: 'Browse marketplace', href: '/events' },
              { icon: '💸', label: 'Sell Ticket', sub: 'List on secondary', href: '#' },
              { icon: '➕', label: 'Create Event', sub: 'Issue NFT tickets', href: '#' },
              { icon: '🔄', label: 'Transfer', sub: 'Send to wallet', href: '#' },
            ].map((qa, i) => (
              <Link key={i} href={qa.href} onClick={() => qa.href === '#' && showToast(`${qa.icon} ${qa.label} coming soon!`)}
                style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '18px', padding: '20px', textAlign: 'center', cursor: 'pointer', textDecoration: 'none', display: 'block', transition: 'transform 0.2s' }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{qa.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F0A1E', marginBottom: '3px' }}>{qa.label}</div>
                <div style={{ fontSize: '11px', color: '#9896B0' }}>{qa.sub}</div>
              </Link>
            ))}
          </div>

          {/* TWO COL: Tickets + Wallet */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', marginBottom: '24px' }}>

            {/* MY TICKETS */}
            <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F0A1E' }}>🎫 My Tickets</div>
                  <div style={{ fontSize: '12px', color: '#9896B0', marginTop: '2px' }}>All your NFT tickets</div>
                </div>
                <Link href="/events" style={{ fontSize: '13px', fontWeight: 600, color: '#7C3AED', textDecoration: 'none' }}>View All →</Link>
              </div>

              {/* Filter Tabs */}
              <div style={{ display: 'flex', gap: '4px', padding: '0 24px', marginBottom: '16px' }}>
                {[
                  { val: 'all', label: `All (${tickets.length})` },
                  { val: 'upcoming', label: 'Upcoming (2)' },
                  { val: 'listed', label: 'Listed (1)' },
                  { val: 'used', label: 'Used (1)' },
                ].map((tab) => (
                  <button key={tab.val} onClick={() => setTicketFilter(tab.val)}
                    style={{ padding: '7px 16px', borderRadius: '50px', fontSize: '13px', fontWeight: 600, color: ticketFilter === tab.val ? '#7C3AED' : '#9896B0', background: ticketFilter === tab.val ? '#F3F0FF' : 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tickets List */}
              <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredTickets.map((ticket) => (
                  <div key={ticket.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1.5px solid #E8E4F5', borderRadius: '16px', cursor: 'pointer', opacity: ticket.status === 'used' ? 0.6 : 1 }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: ticket.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>{ticket.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F0A1E', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ticket.name}</div>
                      <div style={{ fontSize: '12px', color: '#9896B0' }}>📅 <span style={{ color: '#4B4869', fontWeight: 500 }}>{ticket.date}</span> · 📍 <span style={{ color: '#4B4869', fontWeight: 500 }}>{ticket.city}</span> · <span style={{ color: '#7C3AED', fontWeight: 700 }}>{ticket.tier}</span></div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '50px', background: statusLabel[ticket.status].bg, color: statusLabel[ticket.status].color, flexShrink: 0 }}>
                      {statusLabel[ticket.status].label}
                    </span>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#7C3AED' }}>{ticket.price} ETH</div>
                      <div style={{ fontSize: '11px', color: '#9896B0' }}>≈ ${ticket.usd}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      <button onClick={() => showToast('📋 Details opened!')} style={{ padding: '7px 13px', borderRadius: '9px', fontSize: '12px', fontWeight: 700, border: '1.5px solid #E8E4F5', background: 'white', color: '#4B4869', cursor: 'pointer', fontFamily: 'inherit' }}>Details</button>
                      {ticket.status !== 'used' && (
                        <button onClick={() => showToast(`🎟️ Action for ${ticket.name}!`)} style={{ padding: '7px 13px', borderRadius: '9px', fontSize: '12px', fontWeight: 700, border: 'none', background: '#7C3AED', color: 'white', cursor: 'pointer', fontFamily: 'inherit' }}>
                          {ticket.status === 'live' ? 'Enter' : ticket.status === 'listed' ? 'Delist' : 'Sell'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WALLET PANEL */}
            <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F0A1E' }}>💎 My Wallet</div>
                  <div style={{ fontSize: '12px', color: '#9896B0', marginTop: '2px' }}>Connected via MetaMask</div>
                </div>
                <button style={{ fontSize: '13px', fontWeight: 600, color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>History →</button>
              </div>
              <div style={{ padding: '0 24px 24px' }}>
                {/* Balance */}
                <div style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)', borderRadius: '16px', padding: '22px', position: 'relative', overflow: 'hidden', marginBottom: '16px' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1.5px, transparent 1.5px)', backgroundSize: '18px 18px' }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: '6px' }}>Total Balance</div>
                    <div style={{ fontSize: '32px', fontWeight: 800, color: 'white', lineHeight: 1 }}>2.84 ETH</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>≈ $10,224 USD</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>0x3f2A...9B4c</span>
                      <button onClick={() => showToast('📋 Address copied!')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', fontSize: '12px', padding: '3px 10px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Copy</button>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  {[
                    { label: '📥 Receive', primary: true },
                    { label: '📤 Send', primary: true },
                    { label: '🔄 Swap', primary: false },
                    { label: '🌉 Bridge', primary: false },
                  ].map((btn, i) => (
                    <button key={i} onClick={() => showToast(`${btn.label} coming soon!`)}
                      style={{ padding: '11px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', background: btn.primary ? '#7C3AED' : 'white', color: btn.primary ? 'white' : '#0F0A1E', border: btn.primary ? 'none' : '1.5px solid #E8E4F5', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* Tokens */}
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#9896B0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Token Balances</div>
                {[
                  { icon: '⟠', bg: '#EFF6FF', name: 'Ethereum', chain: 'Mainnet', amount: '2.84 ETH', usd: '$10,224' },
                  { icon: '⬡', bg: '#F3E8FF', name: 'Polygon', chain: 'MATIC', amount: '420 MATIC', usd: '$302' },
                  { icon: '💵', bg: '#EFF6FF', name: 'USD Coin', chain: 'USDC', amount: '850 USDC', usd: '$850' },
                ].map((token, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 0', borderBottom: i < 2 ? '1px solid #E8E4F5' : 'none' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: token.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{token.icon}</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F0A1E' }}>{token.name}</div>
                      <div style={{ fontSize: '11px', color: '#9896B0' }}>{token.chain}</div>
                    </div>
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F0A1E' }}>{token.amount}</div>
                      <div style={{ fontSize: '11px', color: '#9896B0' }}>{token.usd}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* THREE COL: Chart + Activity + Upcoming */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>

            {/* EARNINGS CHART */}
            <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px 0', marginBottom: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F0A1E' }}>📈 Earnings</div>
                <div style={{ fontSize: '12px', color: '#9896B0', marginTop: '2px' }}>Secondary sales revenue</div>
              </div>
              <div style={{ padding: '0 24px 24px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                  {Object.keys(chartData).map((period) => (
                    <button key={period} onClick={() => setChartPeriod(period)}
                      style={{ padding: '5px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 600, color: chartPeriod === period ? '#7C3AED' : '#9896B0', background: chartPeriod === period ? '#F3F0FF' : 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {period}
                    </button>
                  ))}
                </div>
                <div style={{ height: '160px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                  {data.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                      <div style={{ width: '100%', borderRadius: '6px 6px 0 0', background: 'linear-gradient(180deg,#A855F7,#7C3AED)', height: `${(d.val / maxVal) * 100}%`, minHeight: '4px', transition: 'height 0.5s ease' }} />
                      <div style={{ fontSize: '10px', color: '#9896B0', fontWeight: 500 }}>{d.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ACTIVITY */}
            <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F0A1E' }}>⚡ Activity</div>
                  <div style={{ fontSize: '12px', color: '#9896B0', marginTop: '2px' }}>Recent transactions</div>
                </div>
                <button style={{ fontSize: '13px', fontWeight: 600, color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>All →</button>
              </div>
              <div style={{ padding: '0 24px 24px' }}>
                {activities.map((act, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '12px 0', borderBottom: i < activities.length - 1 ? '1px solid #E8E4F5' : 'none' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: act.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: 0 }}>{act.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', color: '#4B4869', lineHeight: 1.4 }}>{act.action} <strong style={{ color: '#0F0A1E' }}>{act.name}</strong></div>
                      <div style={{ fontSize: '11px', color: '#9896B0', marginTop: '2px' }}>{act.time}</div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: act.positive === true ? '#16A34A' : act.positive === false ? '#DC2626' : '#9896B0', flexShrink: 0 }}>{act.amount}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* UPCOMING */}
            <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F0A1E' }}>📅 Upcoming</div>
                  <div style={{ fontSize: '12px', color: '#9896B0', marginTop: '2px' }}>Your next events</div>
                </div>
              </div>
              <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { emoji: '🎵', name: 'Electronic Horizon', date: '28 Mar · Jakarta', countdown: '🔴 Today!', bg: 'linear-gradient(135deg,#667EEA,#764BA2)', countdownColor: '#DC2626', countdownBg: '#FEE2E2' },
                  { emoji: '🎤', name: 'Neon City Rave', date: '5 Apr · Bali', countdown: '⏳ 16 days left', bg: 'linear-gradient(135deg,#F093FB,#F5576C)', countdownColor: '#7C3AED', countdownBg: '#F3F0FF' },
                  { emoji: '🎨', name: 'Metamorphosis Art', date: '19 Apr · Bandung', countdown: '⏳ 30 days left', bg: 'linear-gradient(135deg,#43E97B,#38F9D7)', countdownColor: '#7C3AED', countdownBg: '#F3F0FF' },
                ].map((ev, i) => (
                  <div key={i} style={{ border: '1.5px solid #E8E4F5', borderRadius: '14px', overflow: 'hidden', cursor: 'pointer' }}>
                    <div style={{ height: '70px', background: ev.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px' }}>{ev.emoji}</div>
                    <div style={{ padding: '12px' }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F0A1E', marginBottom: '3px' }}>{ev.name}</div>
                      <div style={{ fontSize: '11px', color: '#9896B0', marginBottom: '8px' }}>📅 {ev.date}</div>
                      <div style={{ background: ev.countdownBg, borderRadius: '8px', padding: '5px 10px', fontSize: '12px', fontWeight: 700, color: ev.countdownColor, textAlign: 'center' }}>{ev.countdown}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div style={{ borderTop: '1px solid #E8E4F5', padding: '20px 36px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '12px', color: '#9896B0' }}>© 2026 TicketPro · All rights reserved</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Help', 'Privacy', 'Terms', 'Status'].map((l, i) => (
              <a key={i} href="#" style={{ fontSize: '12px', color: '#9896B0', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 999, background: '#0F0A1E', color: 'white', padding: '14px 20px', borderRadius: '14px', fontSize: '13px', fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', maxWidth: '320px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {toast}
        </div>
      )}

    </div>
  )
}
