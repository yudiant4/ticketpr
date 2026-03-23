'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useMintTicket } from '@/hooks/useTicketPro'
import { useEvent, useEventCount } from '@/hooks/useTicketPro'
import { formatEther } from 'viem'

const eventData: Record<string, any> = {
  '1': { emoji: '🎵', name: 'Electronic Horizon Festival', org: 'HorizonDAO', date: '28 Mar 2026', time: '18:00 WIB', venue: 'JIEXPO Hall A', city: 'Jakarta', chain: 'Ethereum', supply: 1000, sold: 850, price: 0.01, bg: 'linear-gradient(135deg,#667EEA,#764BA2)', tags: ['Music','EDM','Festival'] },
  '2': { emoji: '🎤', name: 'Neon City Rave Vol. 3', org: 'NeonCollective', date: '5 Apr 2026', time: '20:00 WIB', venue: 'Potato Head', city: 'Bali', chain: 'Polygon', supply: 800, sold: 620, price: 0.008, bg: 'linear-gradient(135deg,#F093FB,#F5576C)', tags: ['Rave','Techno'] },
  '3': { emoji: '💻', name: 'Block Summit 2026', org: 'BlockDAO', date: '12 Apr 2026', time: '09:00 WIB', venue: 'Grand City Hall', city: 'Surabaya', chain: 'Base', supply: 2000, sold: 310, price: 0.005, bg: 'linear-gradient(135deg,#4FACFE,#00F2FE)', tags: ['Web3','Conference'] },
  '4': { emoji: '🎨', name: 'Metamorphosis Art Fair', org: 'ArtOnChain', date: '19 Apr 2026', time: '10:00 WIB', venue: 'Gedung Sate', city: 'Bandung', chain: 'Ethereum', supply: 600, sold: 450, price: 0.007, bg: 'linear-gradient(135deg,#43E97B,#38F9D7)', tags: ['Art','Exhibition'] },
  '5': { emoji: '🎭', name: 'Web3 Culture Festival', org: 'CultureDAO', date: '25 Apr 2026', time: '14:00 WIB', venue: 'Prambanan Area', city: 'Yogyakarta', chain: 'Polygon', supply: 1500, sold: 980, price: 0.006, bg: 'linear-gradient(135deg,#FA709A,#FEE140)', tags: ['Culture','Web3'] },
  '6': { emoji: '🚀', name: 'DeFi Launchpad Night', org: 'DeFiGuild', date: '2 Mei 2026', time: '19:00 WIB', venue: 'The Westin Jakarta', city: 'Jakarta', chain: 'Base', supply: 500, sold: 200, price: 0.005, bg: 'linear-gradient(135deg,#A18CD1,#FBC2EB)', tags: ['DeFi','Networking'] },
}

const tiers = [
  { name: 'General Admission', icon: '🎫', price: 1, perks: ['Main Stage','Side Stage','F&B Access'], sold: 700, total: 800 },
  { name: 'VIP Pass', icon: '⭐', price: 2, perks: ['VIP Lounge','Priority Entry','Free Drinks'], sold: 148, total: 180 },
  { name: 'Legendary Pass', icon: '👑', price: 5.5, perks: ['Backstage','Exclusive NFT','Artist Dinner'], sold: 20, total: 20 },
]

export default function TicketDetail({ params }: { params: { id: string } }) {
  const { isConnected, address } = useAccount()
  const ev = eventData[params.id] || eventData['1']
  const [activeTab, setActiveTab] = useState('about')
  const [selectedTier, setSelectedTier] = useState(0)
  const [qty, setQty] = useState(1)
  const [wished, setWished] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [mintError, setMintError] = useState('')

const { data: contractEvent } = useEvent(BigInt(params.id))
const contractPrice = contractEvent
  ? parseFloat(formatEther((contractEvent as any).price))
  : ev.price
  const { mint, hash, isPending, isConfirming, isSuccess, error } = useMintTicket()

  const tierPrice = contractPrice * tiers[selectedTier].price
  const fee = tierPrice * qty * 0.025
  const total = (tierPrice * qty + fee + 0.003).toFixed(4)
  const supplyPct = Math.round(ev.sold / ev.supply * 100)

  // ✅ FIX: Show modal when blockchain confirms
  useEffect(() => {
    if (isSuccess) {
      setShowModal(true)
      setMintError('')
    }
  }, [isSuccess])

  // ✅ FIX: Show error to user
  useEffect(() => {
    if (error) {
      const msg = (error as any)?.message || ''
      if (msg.includes('User rejected') || msg.includes('user rejected')) {
        setMintError('❌ Transaction rejected in MetaMask.')
      } else if (msg.includes('insufficient funds')) {
        setMintError('❌ Insufficient ETH balance!')
      } else if (msg.includes('execution reverted')) {
        setMintError('❌ Contract error. Check event is active and supply available.')
      } else {
        setMintError('❌ Mint failed. Please try again.')
      }
    }
  }, [error])

  // 1. Fungsi handleMint yang sudah rapi
  const handleMint = async () => {
    if (!isConnected) {
      setMintError('Please connect your wallet first!');
      return;
    }

    setMintError('');

    try {
      await mint(
        BigInt(params.id),            // eventId (Dinamis)
        tiers[selectedTier].name,     // "Standard" / "VIP" / "VVIP"
        ev.name,                      // Nama Event
        ev.date,                      // Tanggal
        ev.venue,                     // Lokasi
        ev.city,                      // Kota
        tierPrice.toFixed(4)          // Harga dalam ETH (String)
      );
    } catch (err: any) {              
      const msg = err?.message || '';
      console.error("Mint Error Details:", err);

      if (msg.includes('User rejected') || msg.includes('user rejected')) {
        setMintError('❌ Transaction rejected in MetaMask.');
      } else if (msg.includes('insufficient funds')) {
        setMintError('❌ Insufficient ETH balance!');
      } else if (msg.includes('execution reverted')) {
        setMintError('❌ Contract error: Make sure this Event ID exists!');
      } else {
        setMintError('❌ ' + (msg.slice(0, 100) || 'Mint failed.'));
      }
    }
  };


  return (
    <main style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', background: '#FAFAFF', color: '#0F0A1E' }}>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0 48px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #E8E4F5' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '20px', color: '#0F0A1E', textDecoration: 'none' }}>
          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🎟️</div>
          Ticket<span style={{ color: '#7C3AED' }}>Pro</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <Link href="/create-event" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Create Event</Link>
<Link href="/market" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Market</Link>
<Link href="/verify" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Verify</Link>
        </div>
        <ConnectButton />
      </nav>

      {/* BREADCRUMB */}
      <div style={{ background: 'white', borderBottom: '1px solid #E8E4F5', padding: '14px 48px' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#9896B0' }}>
          <Link href="/" style={{ color: '#9896B0', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/events" style={{ color: '#9896B0', textDecoration: 'none' }}>Browse Events</Link>
          <span>/</span>
          <span style={{ color: '#0F0A1E', fontWeight: 600 }}>{ev.name}</span>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '36px 48px 80px', display: 'grid', gridTemplateColumns: '1fr 420px', gap: '36px', alignItems: 'start' }}>

        {/* LEFT */}
        <div>
          <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '24px', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 4px 24px rgba(124,58,237,0.12)' }}>
            <div style={{ height: '280px', background: ev.bg, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
              <span style={{ fontSize: '90px', filter: 'drop-shadow(0 12px 32px rgba(0,0,0,0.3))', position: 'relative', zIndex: 1 }}>{ev.emoji}</span>
              <span style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.35)', borderRadius: '50px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, color: 'white' }}>🔴 Live Minting</span>
              <span style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.9)', borderRadius: '50px', padding: '5px 14px', fontSize: '12px', fontWeight: 700, color: '#7C3AED' }}>{ev.chain}</span>
            </div>

            <div style={{ padding: '20px 28px 0' }}>
              <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg,#7C3AED,#A855F7)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{ev.emoji}</div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F0A1E' }}>{ev.name}</div>
                  <div style={{ fontSize: '13px', color: '#7C3AED', fontWeight: 600 }}>by {ev.org}</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#9896B0' }}>Token ID</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#7C3AED' }}>#TKP-{params.id.padStart(4,'0')}</div>
                </div>
              </div>
            </div>

            <div style={{ padding: '20px 28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ flex: 1, borderTop: '2px dashed #E8E4F5' }} />
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#9896B0', letterSpacing: '0.15em', textTransform: 'uppercase' }}>✂ tear here</span>
              <div style={{ flex: 1, borderTop: '2px dashed #E8E4F5' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', padding: '0 28px 24px' }}>
              {[
                { label: '📅 Date', val: ev.date, sub: 'Saturday' },
                { label: '⏰ Time', val: ev.time, sub: 'Until 23:00' },
                { label: '📍 Venue', val: ev.venue, sub: ev.city },
                { label: '🎟️ Supply', val: `${ev.supply} NFTs`, sub: 'ERC-721' },
                { label: '💸 Royalty', val: '5%', sub: 'Secondary sales' },
                { label: '🌐 Chain', val: ev.chain, sub: 'EIP-2981' },
              ].map((info, i) => (
                <div key={i} style={{ padding: '14px 12px', borderRight: i % 3 !== 2 ? '1px dashed #E8E4F5' : 'none' }}>
                  <div style={{ fontSize: '11px', color: '#9896B0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{info.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F0A1E' }}>{info.val}</div>
                  <div style={{ fontSize: '11px', color: '#9896B0', marginTop: '2px' }}>{info.sub}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: '16px 28px 24px', display: 'flex', alignItems: 'center', gap: '20px', background: '#FAFAFF' }}>
              <div style={{ width: '72px', height: '72px', background: 'white', border: '1px solid #E8E4F5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '44px', flexShrink: 0 }}>📱</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F0A1E', marginBottom: '4px' }}>On-Chain Verification</div>
                <div style={{ fontSize: '12px', color: '#9896B0', lineHeight: 1.5 }}>QR code generated after mint. Show at gate for instant blockchain verification.</div>
                <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#7C3AED', background: '#F3F0FF', padding: '3px 8px', borderRadius: '6px', marginTop: '6px', display: 'inline-block' }}>0x7C3AED...F97316</div>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #E8E4F5', padding: '0 24px' }}>
              {['about','tiers','properties','history'].map((tab) => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{ padding: '16px 20px', fontSize: '14px', fontWeight: 600, color: activeTab === tab ? '#7C3AED' : '#9896B0', background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab ? '#7C3AED' : 'transparent'}`, cursor: 'pointer', marginBottom: '-1px', fontFamily: 'inherit', textTransform: 'capitalize' }}>
                  {tab === 'about' ? 'About Event' : tab === 'tiers' ? 'Ticket Tiers' : tab === 'properties' ? 'NFT Properties' : 'History'}
                </button>
              ))}
            </div>

            <div style={{ padding: '28px' }}>
              {activeTab === 'about' && (
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 800, marginBottom: '6px' }}>{ev.name}</div>
                  <div style={{ fontSize: '14px', color: '#7C3AED', fontWeight: 600, marginBottom: '16px' }}>Organized by {ev.org} · Verified ✅</div>
                  <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#4B4869', marginBottom: '24px' }}>
                    One of the biggest events in Indonesia returns for 2026! Featuring world-class performers, stunning art installations, and fully on-chain NFT ticketing. Every ticket is a unique NFT stored forever on {ev.chain}.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px' }}>
                    {[
                      { icon: '🎧', title: '10+ Performers', sub: 'Main Stage · Side Stage' },
                      { icon: '🎨', title: 'NFT Art Installations', sub: 'Live minting during event' },
                      { icon: '🍔', title: 'F&B Area', sub: '30+ food & beverage stalls' },
                      { icon: '🅿️', title: 'Free Parking', sub: '2,000 parking slots' },
                    ].map((h, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', background: '#FAFAFF', borderRadius: '12px', padding: '14px' }}>
                        <span style={{ fontSize: '22px' }}>{h.icon}</span>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F0A1E' }}>{h.title}</div>
                          <div style={{ fontSize: '12px', color: '#9896B0', marginTop: '2px' }}>{h.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'tiers' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {tiers.map((tier, i) => {
                    const soldOut = tier.sold >= tier.total
                    return (
                      <div key={i} onClick={() => !soldOut && setSelectedTier(i)}
                        style={{ border: `2px solid ${selectedTier === i && !soldOut ? '#7C3AED' : '#E8E4F5'}`, borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', cursor: soldOut ? 'not-allowed' : 'pointer', opacity: soldOut ? 0.6 : 1, background: selectedTier === i && !soldOut ? '#F3F0FF' : 'white', position: 'relative' }}>
                        {selectedTier === i && !soldOut && <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#7C3AED', color: 'white', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '50px' }}>Selected</span>}
                        {soldOut && <span style={{ position: 'absolute', top: '12px', right: '12px', background: '#F3F4F6', color: '#9896B0', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '50px' }}>Sold Out</span>}
                        <div style={{ width: '50px', height: '50px', borderRadius: '14px', background: i === 0 ? '#EFF6FF' : i === 1 ? '#F3F0FF' : 'linear-gradient(135deg,#FEF3C7,#FDE68A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 }}>{tier.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F0A1E', marginBottom: '4px' }}>{tier.name}</div>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {tier.perks.map((p, j) => <span key={j} style={{ fontSize: '11px', fontWeight: 600, padding: '3px 8px', borderRadius: '50px', background: '#F3F0FF', color: '#7C3AED' }}>{p}</span>)}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: '11px', color: '#9896B0' }}>{tier.sold}/{tier.total} sold</div>
                          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F0A1E' }}>{(ev.price * tier.price).toFixed(4)} ETH</div>
                          <div style={{ width: '100px', height: '4px', background: '#E5E7EB', borderRadius: '99px', marginTop: '6px', marginLeft: 'auto' }}>
                            <div style={{ height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg,#7C3AED,#A855F7)', width: `${Math.round(tier.sold/tier.total*100)}%` }} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {activeTab === 'properties' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
                  {[
                    { type: 'Event Type', val: 'Music Festival', rarity: '42% have this' },
                    { type: 'Tier', val: tiers[selectedTier].name, rarity: '80% have this' },
                    { type: 'Chain', val: ev.chain, rarity: '55% have this' },
                    { type: 'Year', val: '2026', rarity: '100% have this' },
                    { type: 'Collectible', val: 'Post-Event NFT', rarity: 'Rare · 8%' },
                    { type: 'City', val: ev.city, rarity: '30% have this' },
                  ].map((p, i) => (
                    <div key={i} style={{ background: '#F3F0FF', border: '1px solid rgba(124,58,237,0.15)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>{p.type}</div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F0A1E', marginBottom: '3px' }}>{p.val}</div>
                      <div style={{ fontSize: '11px', color: '#9896B0' }}>{p.rarity}</div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'history' && (
                <div>
                  {[
                    { icon: '🎫', action: 'Minted by', addr: '0x3f2A...9B4c', time: '2 hours ago', type: 'Mint', price: `${ev.price} ETH`, typeColor: '#16A34A', typeBg: '#DCFCE7' },
                    { icon: '💸', action: 'Sold by', addr: '0x7A1D...2E5f', time: '5 hours ago', type: 'Sale', price: `${(ev.price * 1.2).toFixed(4)} ETH`, typeColor: '#D97706', typeBg: '#FEF3C7' },
                    { icon: '🔄', action: 'Transferred to', addr: '0x9C3B...4A1d', time: '1 day ago', type: 'Transfer', price: '—', typeColor: '#2563EB', typeBg: '#EFF6FF' },
                  ].map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 0', borderBottom: i < 2 ? '1px solid #E8E4F5' : 'none' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>{h.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F0A1E' }}>{h.action} <span style={{ color: '#7C3AED', fontFamily: 'monospace' }}>{h.addr}</span></div>
                        <div style={{ fontSize: '12px', color: '#9896B0', marginTop: '2px' }}>{h.time} · <span style={{ background: h.typeBg, color: h.typeColor, fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '50px' }}>{h.type}</span></div>
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F0A1E' }}>{h.price}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — MINT PANEL */}
        <div style={{ position: 'sticky', top: '88px', background: 'white', border: '1px solid #E8E4F5', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(124,58,237,0.12)' }}>
          <div style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)', padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1.5px, transparent 1.5px)', backgroundSize: '20px 20px' }} />
            <div style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50px', padding: '5px 12px', fontSize: '12px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '6px', zIndex: 1 }}>
              <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ADE80' }} />
              Live Minting
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Current Price</div>
              <div style={{ fontSize: '36px', fontWeight: 800, color: 'white', lineHeight: 1 }}>{tierPrice.toFixed(4)} ETH</div>
              <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>≈ ${(tierPrice * 3600).toFixed(2)} USD</div>
            </div>
          </div>

          <div style={{ padding: '24px' }}>
            {/* Supply */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                <span style={{ color: '#9896B0', fontWeight: 500 }}>🎟️ Tickets Sold</span>
                <span style={{ fontWeight: 700, color: '#0F0A1E' }}>{ev.sold} / {ev.supply}</span>
              </div>
              <div style={{ height: '8px', background: '#F3F0FF', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '99px', background: 'linear-gradient(90deg,#7C3AED,#A855F7)', width: `${supplyPct}%` }} />
              </div>
              <div style={{ fontSize: '11px', color: '#7C3AED', fontWeight: 700, textAlign: 'right', marginTop: '4px' }}>{supplyPct}% sold · {ev.supply - ev.sold} remaining</div>
            </div>

            {/* Selected Tier */}
            <div onClick={() => setActiveTab('tiers')} style={{ background: '#F3F0FF', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '14px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', cursor: 'pointer' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#9896B0', fontWeight: 500, marginBottom: '3px' }}>Selected Tier</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F0A1E' }}>{tiers[selectedTier].icon} {tiers[selectedTier].name}</div>
              </div>
              <span style={{ color: '#7C3AED', fontSize: '16px' }}>▼</span>
            </div>

            {/* Quantity */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F0A1E' }}>Quantity</div>
                <div style={{ fontSize: '11px', color: '#9896B0' }}>Max 5 per wallet</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1.5px solid #E8E4F5', background: 'white', fontSize: '18px', fontWeight: 700, color: '#4B4869', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>−</button>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#0F0A1E', minWidth: '24px', textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(Math.min(5, qty + 1))} style={{ width: '36px', height: '36px', borderRadius: '10px', border: '1.5px solid #E8E4F5', background: 'white', fontSize: '18px', fontWeight: 700, color: '#4B4869', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit' }}>+</button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div style={{ background: '#FAFAFF', borderRadius: '14px', padding: '16px', marginBottom: '20px' }}>
              {[
                { label: 'Price per ticket', val: `${tierPrice.toFixed(4)} ETH` },
                { label: 'Quantity', val: `× ${qty}` },
                { label: 'Platform fee (2.5%)', val: `${fee.toFixed(4)} ETH` },
                { label: 'Gas estimate', val: '~0.003 ETH' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                  <span style={{ color: '#9896B0', fontWeight: 500 }}>{row.label}</span>
                  <span style={{ color: '#4B4869', fontWeight: 600 }}>{row.val}</span>
                </div>
              ))}
              <div style={{ height: '1px', background: '#E8E4F5', margin: '12px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F0A1E' }}>Total</span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#7C3AED' }}>{total} ETH</span>
              </div>
            </div>

            {/* Wallet Info */}
            <div style={{ background: '#F3F0FF', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '14px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: isConnected ? '#4ADE80' : '#9896B0', flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#7C3AED' }}>
                  {isConnected && address ? `${address.slice(0,6)}...${address.slice(-4)}` : 'Not connected'}
                </div>
                <div style={{ fontSize: '12px', color: '#9896B0', marginTop: '2px' }}>
                  {isConnected ? 'Sepolia Testnet' : 'Connect wallet to mint'}
                </div>
              </div>
            </div>

            {/* ✅ Error Message */}
            {mintError && (
              <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', marginBottom: '12px', fontSize: '13px', color: '#DC2626', fontWeight: 600 }}>
                {mintError}
              </div>
            )}

            {/* ✅ Mint Button */}
            <button
              onClick={handleMint}
              disabled={isPending || isConfirming}
              style={{
                width: '100%', padding: '16px',
                background: !isConnected
                  ? '#E8E4F5'
                  : isPending || isConfirming
                  ? '#A855F7'
                  : 'linear-gradient(135deg,#7C3AED,#A855F7)',
                color: !isConnected ? '#9896B0' : 'white',
                border: 'none', borderRadius: '14px',
                fontSize: '16px', fontWeight: 800,
                cursor: isPending || isConfirming ? 'not-allowed' : 'pointer',
                marginBottom: '12px', fontFamily: 'inherit',
                boxShadow: isConnected ? '0 6px 24px rgba(124,58,237,0.4)' : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'all 0.2s',
              }}>
              {!isConnected
                ? '🔗 Connect Wallet First'
                : isPending
                ? '⏳ Waiting for MetaMask...'
                : isConfirming
                ? '⛓️ Confirming on blockchain...'
                : `🎟️ Mint for ${tierPrice.toFixed(4)} ETH`}
            </button>

            <button onClick={() => setWished(!wished)}
              style={{ width: '100%', padding: '13px', background: 'white', color: wished ? '#EC4899' : '#7C3AED', border: `2px solid ${wished ? '#EC4899' : '#E8E4F5'}`, borderRadius: '14px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginBottom: '20px', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {wished ? '❤️ Saved to Wishlist' : '🤍 Add to Wishlist'}
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '16px', borderTop: '1px solid #E8E4F5' }}>
              {['🔐 Smart contract on Sepolia blockchain', '⚡ Instant delivery to your wallet', '🔄 Tradeable on secondary market', '🛡️ Anti-fraud blockchain verification'].map((t, i) => (
                <div key={i} style={{ fontSize: '12px', color: '#9896B0', display: 'flex', alignItems: 'center', gap: '8px' }}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RELATED */}
      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '0 48px 80px' }}>
        <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '20px' }}>You Might Also Like</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
          {Object.entries(eventData).filter(([id]) => id !== params.id).slice(0, 3).map(([id, ev]: [string, any]) => (
            <Link key={id} href={`/ticket/${id}`} style={{ textDecoration: 'none', background: 'white', border: '1px solid #E8E4F5', borderRadius: '16px', overflow: 'hidden', display: 'block' }}>
              <div style={{ height: '100px', background: ev.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>{ev.emoji}</div>
              <div style={{ padding: '14px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F0A1E', marginBottom: '4px' }}>{ev.name}</div>
                <div style={{ fontSize: '12px', color: '#9896B0', marginBottom: '10px' }}>📅 {ev.date} · 📍 {ev.city}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#7C3AED' }}>{ev.price} ETH</div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#7C3AED', background: '#F3F0FF', padding: '6px 14px', borderRadius: '50px' }}>View →</span>
                </div>
              </div>
            </Link>
          ))}
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

      {/* MINT SUCCESS MODAL */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(15,10,30,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '28px', padding: '40px', width: '440px', textAlign: 'center', boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>🎉</div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0F0A1E', marginBottom: '8px' }}>Mint Successful!</div>
            <p style={{ fontSize: '14px', color: '#9896B0', lineHeight: 1.6, marginBottom: '24px' }}>
              Your NFT ticket is now on Sepolia blockchain! Check your wallet and dashboard.
            </p>
            {hash && (
              <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank"
                style={{ display: 'block', background: '#F3F0FF', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '12px', padding: '14px', marginBottom: '24px', fontFamily: 'monospace', fontSize: '12px', fontWeight: 700, color: '#7C3AED', textDecoration: 'none', wordBreak: 'break-all' }}>
                🔍 Tx: {hash.slice(0, 24)}...
              </a>
            )}
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link href="/dashboard" style={{ flex: 1, padding: '13px', background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: 'white', borderRadius: '12px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                View My Tickets →
              </Link>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '13px', background: 'white', color: '#4B4869', border: '1.5px solid #E8E4F5', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )
    </main>
  )
}