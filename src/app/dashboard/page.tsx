'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { formatEther } from 'viem'
import {
  useWalletBalance,
  useMyTickets,
  useTicket,
  useEventCount,
  useETHPrice,
  useUseTicket,
} from '@/hooks/useTicketPro'

// Single ticket row component
function TicketRow({ tokenId, ethPrice }: { tokenId: bigint, ethPrice: number }) {
  const { data: ticket } = useTicket(tokenId)
  const { useTicketFn, isPending, isSuccess } = useUseTicket()

  if (!ticket) return null

  // BUNGKUS TICKET DI SINI AGAR TYPESCRIPT VERCEL TIDAK PROTES LAGI
  const t = ticket as any;

  const statusColor = t.used
    ? { label: '✅ Used', color: '#9896B0', bg: '#F3F4F6' }
    : { label: '🎫 Active', color: '#16A34A', bg: '#DCFCE7' }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1.5px solid #E8E4F5', borderRadius: '16px', opacity: t.used ? 0.6 : 1 }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>🎟️</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F0A1E' }}>
          Token #{tokenId.toString()} · {t.tier}
        </div>
        <div style={{ fontSize: '12px', color: '#9896B0', marginTop: '3px' }}>
          Event ID: #{t.eventId.toString()} · Owner: {t.originalOwner.slice(0, 6)}...{t.originalOwner.slice(-4)}
        </div>
      </div>
      <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '50px', background: statusColor.bg, color: statusColor.color, flexShrink: 0 }}>
        {isSuccess ? '✅ Used' : statusColor.label}
      </span>
      {!t.used && !isSuccess && (
        <button
          onClick={() => useTicketFn(tokenId)}
          disabled={isPending}
          style={{ padding: '7px 13px', borderRadius: '9px', fontSize: '12px', fontWeight: 700, border: 'none', background: isPending ? '#A855F7' : '#7C3AED', color: 'white', cursor: isPending ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
          {isPending ? '⏳...' : 'Use Ticket'}
        </button>
      )}
    </div>
  )
}

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: balance } = useWalletBalance()
  const { data: myTicketIds } = useMyTickets()
  const { data: eventCount } = useEventCount()
  const { data: ethPriceData } = useETHPrice()
  const [chartPeriod, setChartPeriod] = useState('7D')
  const [toast, setToast] = useState('')

  // ETH Price from Chainlink oracle (dibungkus as any biar aman)
  const ethPrice = ethPriceData
    ? Number((ethPriceData as any)[1]) / 1e8
    : 0

  const balanceETH = balance ? parseFloat(formatEther((balance as any).value)) : 0
  const balanceUSD = (balanceETH * ethPrice).toFixed(2)
  const ticketCount = myTicketIds ? (myTicketIds as any).length : 0

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const chartData: Record<string, { label: string, val: number }[]> = {
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

  const data = chartData[chartPeriod]
  const maxVal = Math.max(...data.map(d => d.val))

  // Not connected state
  if (!isConnected) {
    return (
      <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', minHeight: '100vh', background: '#FAFAFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px' }}>
        <div style={{ fontSize: '64px' }}>🔐</div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F0A1E' }}>Connect Your Wallet</div>
        <p style={{ fontSize: '15px', color: '#9896B0', textAlign: 'center', maxWidth: '360px', lineHeight: 1.6 }}>
          Connect your MetaMask wallet to access your NFT tickets and dashboard
        </p>
        <ConnectButton />
        <Link href="/" style={{ fontSize: '14px', color: '#7C3AED', textDecoration: 'none' }}>← Back to Home</Link>
      </div>
    )
  }

  return (
    <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', display: 'flex', minHeight: '100vh', background: '#FAFAFF', color: '#0F0A1E' }}>

      {/* SIDEBAR */}
      <aside style={{ width: '260px', flexShrink: 0, background: 'white', borderRight: '1px solid #E8E4F5', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50, overflowY: 'auto' }}>
        <Link href="/create-event" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Create Event</Link>
<Link href="/market" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Market</Link>
<Link href="/verify" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Verify</Link>

        {/* Profile — Real Wallet Data */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8E4F5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>😎</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F0A1E', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#7C3AED' }}>Sepolia Testnet</div>
            </div>
            <div style={{ background: '#DCFCE7', color: '#16A34A', fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '50px' }}>● Live</div>
          </div>
        </div>

        {/* Menu */}
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {[
            {
              section: 'Main', items: [
                { icon: '🏠', label: 'Dashboard', href: '/dashboard', active: true },
                { icon: '🔍', label: 'Explore Events', href: '/events' },
                { icon: '🎫', label: 'My Tickets', href: '#', badge: ticketCount.toString() },
                { icon: '🛒', label: 'Marketplace', href: '#' },
              ]
            },
            {
              section: 'Manage', items: [
                { icon: '📅', label: 'My Events', href: '#' },
                { icon: '💰', label: 'Earnings', href: '#' },
                { icon: '🔔', label: 'Notifications', href: '#' },
              ]
            },
            {
              section: 'Account', items: [
                { icon: '👤', label: 'Profile', href: '#' },
                { icon: '⚙️', label: 'Settings', href: '#' },
              ]
            },
          ].map((section, si) => (
            <div key={si}>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#9896B0', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '0 12px', marginBottom: '6px', marginTop: si > 0 ? '16px' : '0' }}>{section.section}</div>
              {section.items.map((item: any, ii: number) => (
                <Link key={ii} href={item.href}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: item.active ? '#7C3AED' : '#4B4869', background: item.active ? '#F3F0FF' : 'transparent', textDecoration: 'none', marginBottom: '2px', position: 'relative' }}>
                  {item.active && <div style={{ position: 'absolute', left: 0, top: '6px', bottom: '6px', width: '3px', background: '#7C3AED', borderRadius: '0 3px 3px 0' }} />}
                  <span style={{ fontSize: '18px', width: '22px', textAlign: 'center' }}>{item.icon}</span>
                  {item.label}
                  {item.badge && item.badge !== '0' && <span style={{ marginLeft: 'auto', background: '#7C3AED', color: 'white', fontSize: '10px', fontWeight: 800, padding: '2px 7px', borderRadius: '50px' }}>{item.badge}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid #E8E4F5' }}>
          <button onClick={() => disconnect()} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', width: '100%', fontFamily: 'inherit' }}>
            <span style={{ fontSize: '18px' }}>🚪</span> Disconnect
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        {/* TOPBAR */}
        <div style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #E8E4F5', padding: '0 36px', height: '68px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 40 }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F0A1E' }}>👋 Welcome, {address?.slice(0, 6)}...{address?.slice(-4)}</div>
            <div style={{ fontSize: '12px', color: '#9896B0', marginTop: '1px' }}>
              Sepolia Testnet · {ethPrice > 0 ? `ETH = $${ethPrice.toLocaleString()}` : 'Loading price...'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Live ETH Price Badge */}
            <div style={{ background: '#F3F0FF', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '50px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px' }}>⟠</span>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#7C3AED' }}>
                {ethPrice > 0 ? `$${ethPrice.toLocaleString()}` : '...'}
              </span>
              <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>LIVE</span>
            </div>
            <ConnectButton />
          </div>
        </div>

        {/* PAGE BODY */}
        <div style={{ padding: '32px 36px 80px' }}>

          {/* OVERVIEW CARDS — Real Data */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '18px', marginBottom: '28px' }}>
            <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '18px', padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#F3F0FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>🎫</div>
                <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '50px', background: '#DCFCE7', color: '#16A34A' }}>On-chain</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F0A1E', lineHeight: 1, marginBottom: '5px' }}>{ticketCount}</div>
              <div style={{ fontSize: '13px', color: '#9896B0' }}>My NFT Tickets</div>
              <div style={{ fontSize: '11px', color: '#9896B0', marginTop: '6px' }}>From blockchain</div>
            </div>

            <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '18px', padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>💰</div>
                <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '50px', background: '#DCFCE7', color: '#16A34A' }}>Live</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F0A1E', lineHeight: 1, marginBottom: '5px' }}>
                {balanceETH.toFixed(4)} ETH
              </div>
              <div style={{ fontSize: '13px', color: '#9896B0' }}>Wallet Balance</div>
              <div style={{ fontSize: '11px', color: '#9896B0', marginTop: '6px' }}>
                ≈ ${parseFloat(balanceUSD).toLocaleString()} USD
              </div>
            </div>

            <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '18px', padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>⟠</div>
                <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '50px', background: '#DCFCE7', color: '#16A34A' }}>Chainlink</span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F0A1E', lineHeight: 1, marginBottom: '5px' }}>
                ${ethPrice > 0 ? ethPrice.toLocaleString() : '...'}
              </div>
              <div style={{ fontSize: '13px', color: '#9896B0' }}>ETH Price</div>
              <div style={{ fontSize: '11px', color: '#9896B0', marginTop: '6px' }}>Via Chainlink Oracle</div>
            </div>

            <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '18px', padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>📅</div>
                <span style={{ fontSize: '12px', fontWeight: 700, padding: '3px 8px', borderRadius: '50px', background: '#DCFCE7', color: '#16A34A' }}>On-chain</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F0A1E', lineHeight: 1, marginBottom: '5px' }}>
                {eventCount ? (eventCount as any).toString() : '0'}
              </div>
              <div style={{ fontSize: '13px', color: '#9896B0' }}>Total Events</div>
              <div style={{ fontSize: '11px', color: '#9896B0', marginTop: '6px' }}>Created on contract</div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px', marginBottom: '24px' }}>
            {[
              { icon: '🛒', label: 'Buy Ticket', sub: 'Browse & mint NFT', href: '/events' },
              { icon: '💸', label: 'Sell Ticket', sub: 'List on secondary', href: '#' },
              { icon: '➕', label: 'Create Event', sub: 'Issue NFT tickets', href: '#' },
              { icon: '🔍', label: 'Etherscan', sub: 'View on blockchain', href: `https://sepolia.etherscan.io/address/${address}` },
            ].map((qa, i) => (
              <Link key={i} href={qa.href} target={qa.href.startsWith('http') ? '_blank' : '_self'}
                style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '18px', padding: '20px', textAlign: 'center', cursor: 'pointer', textDecoration: 'none', display: 'block' }}>
                <div style={{ fontSize: '28px', marginBottom: '10px' }}>{qa.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F0A1E', marginBottom: '3px' }}>{qa.label}</div>
                <div style={{ fontSize: '11px', color: '#9896B0' }}>{qa.sub}</div>
              </Link>
            ))}
          </div>

          {/* TWO COL: My Tickets + Wallet */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', marginBottom: '24px' }}>

            {/* MY TICKETS — Real from Blockchain */}
            <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E8E4F5' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F0A1E' }}>🎫 My NFT Tickets</div>
                  <div style={{ fontSize: '12px', color: '#9896B0', marginTop: '2px' }}>Live from Sepolia blockchain</div>
                </div>
                <span style={{ background: '#DCFCE7', color: '#16A34A', fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '50px' }}>
                  {ticketCount} tickets
                </span>
              </div>

              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {!myTicketIds || (myTicketIds as any).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎟️</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F0A1E', marginBottom: '8px' }}>No tickets yet</div>
                    <p style={{ fontSize: '14px', color: '#9896B0', marginBottom: '20px' }}>Mint your first NFT ticket from our events!</p>
                    <Link href="/events" style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: 'white', padding: '12px 24px', borderRadius: '50px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
                      Browse Events →
                    </Link>
                  </div>
                ) : (
                  (myTicketIds as any).map((tokenId: bigint) => (
                    <TicketRow key={tokenId.toString()} tokenId={tokenId} ethPrice={ethPrice} />
                  ))
                )}
              </div>
            </div>

            {/* WALLET — Real Data */}
            <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8E4F5' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F0A1E' }}>💎 My Wallet</div>
                <div style={{ fontSize: '12px', color: '#9896B0', marginTop: '2px' }}>Live blockchain data</div>
              </div>
              <div style={{ padding: '20px 24px' }}>
                {/* Balance Card */}
                <div style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)', borderRadius: '16px', padding: '22px', position: 'relative', overflow: 'hidden', marginBottom: '16px' }}>
                  <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1.5px, transparent 1.5px)', backgroundSize: '18px 18px' }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600, marginBottom: '6px' }}>Total Balance</div>
                    <div style={{ fontSize: '28px', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                      {balanceETH.toFixed(4)} ETH
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                      ≈ ${parseFloat(balanceUSD).toLocaleString()} USD
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
                        {address?.slice(0, 8)}...{address?.slice(-6)}
                      </span>
                      <button
                        onClick={() => { navigator.clipboard.writeText(address || ''); showToast('📋 Address copied!') }}
                        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', fontSize: '12px', padding: '3px 10px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                {/* Etherscan Link */}
                <Link href={`https://sepolia.etherscan.io/address/${address}`} target="_blank"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: '#F3F0FF', borderRadius: '12px', fontSize: '13px', fontWeight: 700, color: '#7C3AED', textDecoration: 'none', marginBottom: '16px' }}>
                  🔍 View on Etherscan →
                </Link>

                {/* ETH Price from Chainlink */}
                <div style={{ background: '#FAFAFF', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#9896B0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>
                    Live Price (Chainlink)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>⟠</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F0A1E' }}>Ethereum</div>
                      <div style={{ fontSize: '11px', color: '#9896B0' }}>ETH/USD</div>
                    </div>
                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F0A1E' }}>
                        ${ethPrice > 0 ? ethPrice.toLocaleString() : '...'}
                      </div>
                      <div style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>● Live</div>
                    </div>
                  </div>
                </div>

                {/* Balance detail */}
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#9896B0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Balance Detail</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #E8E4F5' }}>
                  <span style={{ fontSize: '13px', color: '#4B4869' }}>ETH Balance</span>
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>{balanceETH.toFixed(4)} ETH</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #E8E4F5' }}>
                  <span style={{ fontSize: '13px', color: '#4B4869' }}>USD Value</span>
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>${parseFloat(balanceUSD).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                  <span style={{ fontSize: '13px', color: '#4B4869' }}>Network</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#7C3AED' }}>Sepolia Testnet</span>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: Chart + Contract Info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

            {/* EARNINGS CHART */}
            <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8E4F5' }}>
                <div style={{ fontSize: '16px', fontWeight: 800 }}>📈 Earnings Overview</div>
              </div>
              <div style={{ padding: '20px 24px' }}>
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

            {/* CONTRACT INFO */}
            <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '20px', overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8E4F5' }}>
                <div style={{ fontSize: '16px', fontWeight: 800 }}>📋 Contract Info</div>
                <div style={{ fontSize: '12px', color: '#9896B0', marginTop: '2px' }}>TicketPro Smart Contract</div>
              </div>
              <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: 'Contract Address', val: '0x83C8...0CB7', full: '0x83C8533BbeB920Ccd51d3297BbC4d3B5219d0CB7' },
                  { label: 'Network', val: 'Sepolia Testnet' },
                  { label: 'Standard', val: 'ERC-721' },
                  { label: 'Total Events', val: eventCount ? (eventCount as any).toString() : '0' },
                  { label: 'Platform Fee', val: '2.5%' },
                ].map((info, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 4 ? '1px solid #E8E4F5' : 'none' }}>
                    <span style={{ fontSize: '13px', color: '#9896B0', fontWeight: 500 }}>{info.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: info.label === 'Contract Address' ? '#7C3AED' : '#0F0A1E', fontFamily: info.label === 'Contract Address' ? 'monospace' : 'inherit' }}>{info.val}</span>
                  </div>
                ))}
                <Link href="https://sepolia.etherscan.io/address/0x83C8533BbeB920Ccd51d3297BbC4d3B5219d0CB7" target="_blank"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: '#F3F0FF', borderRadius: '12px', fontSize: '13px', fontWeight: 700, color: '#7C3AED', textDecoration: 'none', marginTop: '4px' }}>
                  🔍 View Contract on Etherscan →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ borderTop: '1px solid #E8E4F5', padding: '20px 36px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '12px', color: '#9896B0' }}>© 2026 TicketPro · Sepolia Testnet</div>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Help', 'Privacy', 'Terms'].map((l, i) => (
              <a key={i} href="#" style={{ fontSize: '12px', color: '#9896B0', textDecoration: 'none' }}>{l}</a>
            ))}
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 999, background: '#0F0A1E', color: 'white', padding: '14px 20px', borderRadius: '14px', fontSize: '13px', fontWeight: 600, boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
          {toast}
        </div>
      )}
    </div>
  )
}