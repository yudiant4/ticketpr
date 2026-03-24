'use client'

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAccount, useReadContract, useBalance } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  
  // State UI
  const [activeTab, setActiveTab] = useState('about')
  const [qty, setQty] = useState(1)
  const [selectedTier, setSelectedTier] = useState({ name: 'General Admission', price: 0.45 })
  const [isWished, setIsWished] = useState(false)

  // Perhitungan Harga
  const platformFee = selectedTier.price * qty * 0.025
  const totalPrice = (selectedTier.price * qty) + platformFee + 0.003 // + gas estimate

  return (
    <main style={{ background: '#FAFAFF', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <Navbar />

      {/* 1. BREADCRUMB */}
      <div style={{ background: 'white', borderBottom: '1px solid #E8E4F5', padding: '14px 48px', marginTop: '72px' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', fontSize: '13px', color: '#9896B0', display: 'flex', gap: '8px' }}>
          <Link href="/" style={{ color: '#9896B0', textDecoration: 'none' }}>Home</Link>
          <span>/</span>
          <Link href="/market" style={{ color: '#9896B0', textDecoration: 'none' }}>Browse Events</Link>
          <span>/</span>
          <span style={{ color: '#0F0A1E', fontWeight: 600 }}>Electronic Horizon Festival</span>
        </div>
      </div>

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '36px 24px 80px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '36px', alignItems: 'start' }}>
        
        {/* === LEFT COLUMN: TICKET DETAIL === */}
        <div className="fade-up">
          
          {/* Visual Tiket dengan Efek Perforasi */}
          <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(124, 58, 237, 0.08)' }}>
            <div style={{ height: '280px', background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 60%, #EC4899 100%)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '50px', color: 'white', fontSize: '12px', fontWeight: 700 }}>🔴 Live Minting</div>
              <div style={{ fontSize: '100px' }}>🎵</div>
              <div style={{ position: 'absolute', bottom: '20px', right: '20px', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace', fontSize: '11px' }}>#EHF-2026-{params.id}</div>
            </div>

            {/* Info Box Overlay */}
            <div style={{ margin: '-40px 28px 0', position: 'relative', background: 'white', border: '1px solid #E8E4F5', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
              <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, #7C3AED, #A855F7)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>🎵</div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '17px' }}>Electronic Horizon Festival</div>
                <div style={{ fontSize: '13px', color: '#7C3AED', fontWeight: 600 }}>by HorizonDAO</div>
              </div>
            </div>

            {/* Sobekan Tiket (Perforated) */}
            <div style={{ padding: '30px 0', display: 'flex', alignItems: 'center', position: 'relative' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#FAFAFF', border: '1px solid #E8E4F5', marginLeft: '-10px' }}></div>
              <div style={{ flex: 1, borderTop: '2px dashed #E8E4F5', margin: '0 10px' }}></div>
              <span style={{ fontSize: '10px', color: '#9896B0', fontWeight: 700, letterSpacing: '0.1em' }}>✂ TEAR HERE</span>
              <div style={{ flex: 1, borderTop: '2px dashed #E8E4F5', margin: '0 10px' }}></div>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#FAFAFF', border: '1px solid #E8E4F5', marginRight: '-10px' }}></div>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', padding: '0 28px 24px' }}>
              {[
                { label: '📅 Date', val: '28 Mar 2026' },
                { label: '⏰ Time', val: '18:00 WIB' },
                { label: '📍 Venue', val: 'JIEXPO Hall A' },
                { label: '🎟️ Supply', val: '1,000 NFTs' },
                { label: '💸 Royalty', val: '5%' },
                { label: '🌐 Chain', val: 'Ethereum' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '16px 10px', borderRight: (i+1)%3 !== 0 ? '1px dashed #E8E4F5' : 'none' }}>
                  <div style={{ fontSize: '11px', color: '#9896B0', fontWeight: 600, textTransform: 'uppercase' }}>{item.label}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700 }}>{item.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* TABS SECTION */}
          <div style={{ marginTop: '28px', background: 'white', border: '1px solid #E8E4F5', borderRadius: '20px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #E8E4F5', padding: '0 24px' }}>
              {['about', 'tiers', 'history'].map((t) => (
                <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '16px 20px', background: 'none', border: 'none', borderBottom: activeTab === t ? '2px solid #7C3AED' : '2px solid transparent', color: activeTab === t ? '#7C3AED' : '#9896B0', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>
                  {t} Event
                </button>
              ))}
            </div>
            <div style={{ padding: '28px' }}>
              {activeTab === 'about' && (
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '10px' }}>About Event 🎪</h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#4B4869' }}>
                    The biggest electronic music festival in Indonesia returns for 2026! Featuring world-class DJs, stunning visual art installations, and fully on-chain NFT ticketing.
                  </p>
                </div>
              )}
              {activeTab === 'tiers' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { name: 'General Admission', price: 0.45, icon: '🎫' },
                    { name: 'VIP Pass', price: 0.90, icon: '⭐' },
                  ].map((tier, i) => (
                    <div key={i} onClick={() => setSelectedTier(tier)} style={{ border: selectedTier.name === tier.name ? '2px solid #7C3AED' : '2px solid #E8E4F5', padding: '16px', borderRadius: '16px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: selectedTier.name === tier.name ? '#F3F0FF' : 'white' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px' }}>{tier.icon}</span>
                        <div style={{ fontWeight: 800 }}>{tier.name}</div>
                      </div>
                      <div style={{ fontWeight: 800 }}>{tier.price} ETH</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN: MINT PANEL === */}
        <aside style={{ position: 'sticky', top: '88px', background: 'white', border: '1px solid #E8E4F5', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(124, 58, 237, 0.12)' }}>
          <div style={{ background: 'linear-gradient(135deg, #7C3AED, #A855F7)', padding: '24px', color: 'white' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase' }}>Current Price</div>
            <div style={{ fontSize: '36px', fontWeight: 800 }}>{selectedTier.price} ETH</div>
            <div style={{ fontSize: '14px', opacity: 0.7 }}>≈ ${(selectedTier.price * 3600).toLocaleString()} USD</div>
          </div>

          <div style={{ padding: '24px' }}>
            {/* Supply Progress */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
                <span style={{ color: '#9896B0' }}>🎟️ Tickets Sold</span>
                <span style={{ fontWeight: 700 }}>850 / 1,000</span>
              </div>
              <div style={{ height: '8px', background: '#F3F0FF', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, #7C3AED, #A855F7)' }}></div>
              </div>
            </div>

            {/* Qty Control */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontWeight: 600 }}>Quantity</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #E8E4F5', background: 'white', cursor: 'pointer' }}>−</button>
                <span style={{ fontWeight: 800 }}>{qty}</span>
                <button onClick={() => setQty(Math.min(5, qty + 1))} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid #E8E4F5', background: 'white', cursor: 'pointer' }}>+</button>
              </div>
            </div>

            {/* Price Breakdown */}
            <div style={{ background: '#FAFAFF', borderRadius: '14px', padding: '16px', marginBottom: '20px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#9896B0' }}>Price per ticket</span>
                <span>{selectedTier.price} ETH</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#9896B0' }}>Platform fee (2.5%)</span>
                <span>{platformFee.toFixed(3)} ETH</span>
              </div>
              <div style={{ height: '1px', background: '#E8E4F5', margin: '12px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '16px' }}>
                <span>Total</span>
                <span style={{ color: '#7C3AED' }}>{totalPrice.toFixed(3)} ETH</span>
              </div>
            </div>

            {/* Wallet Info (REAL) */}
            <div style={{ background: '#F3F0FF', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '14px', padding: '14px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '10px', height: '10px', background: '#4ADE80', borderRadius: '50%' }}></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 700, fontFamily: 'monospace' }}>{address ? `${address.slice(0,6)}...${address.slice(-4)}` : 'Not Connected'}</div>
                <div style={{ fontSize: '11px', color: '#9896B0' }}>Balance: {balance ? parseFloat(balance.formatted).toFixed(4) : '0.00'} {balance?.symbol}</div>
              </div>
            </div>

            <button style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #7C3AED, #A855F7)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 6px 24px rgba(124,58,237,0.4)' }}>
              🎟️ Mint NFT Ticket
            </button>

            <button onClick={() => setIsWished(!isWished)} style={{ width: '100%', padding: '12px', background: 'none', border: '2px solid #E8E4F5', borderRadius: '14px', color: isWished ? '#EC4899' : '#4B4869', fontWeight: 700, marginTop: '12px', cursor: 'pointer' }}>
              {isWished ? '❤️ Saved' : '🤍 Add to Wishlist'}
            </button>
          </div>
        </aside>
      </div>

      <Footer />
    </main>
  )
}