'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { formatEther } from 'viem'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import Navbar from './components/Navbar' // Import Navbar terpusat kamu

// --- DATA FEATURED (Untuk pemanis Landing Page) ---
const featuredEvents = [
  { id: 'f1', emoji: '🎵', name: 'Electronic Horizon', city: 'Jakarta', price: '0.05', bg: 'linear-gradient(135deg,#667EEA,#764BA2)' },
  { id: 'f2', emoji: '🚀', name: 'Web3 Launchpad', city: 'Bali', price: '0.02', bg: 'linear-gradient(135deg,#F093FB,#F5576C)' },
]

export default function HomePage() {
  const [isMobile, setIsMobile] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // AMBIL TOTAL EVENT DARI BLOCKCHAIN
  const { data: eventCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'eventCount',
  })

  return (
    <main style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', background: '#FAFAFF', minHeight: '100vh', color: '#0F0A1E' }}>
      
      {/* 1. NAVBAR TERPUSAT */}
      <Navbar />

      {/* 2. HERO SECTION (Halaman Utama) */}
      <div style={{ 
        background: 'linear-gradient(135deg,#7C3AED,#A855F7,#EC4899)', 
        padding: isMobile ? '60px 20px' : '100px 48px', 
        position: 'relative', 
        overflow: 'hidden',
        textAlign: isMobile ? 'center' : 'left'
      }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.12) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: isMobile ? '36px' : '56px', fontWeight: 800, color: 'white', lineHeight: 1.1 }}>
            The Future of <br/> <span style={{ color: '#FEE140' }}>NFT Ticketing</span>
          </h1>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', marginTop: '20px', maxWidth: '600px' }}>
            Secure, verifiable, and collectible. Join thousands of creators selling official event tickets on the blockchain.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '32px', justifyContent: isMobile ? 'center' : 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}>
            <Link href="/market" style={{ background: 'white', color: '#7C3AED', padding: '16px 32px', borderRadius: '50px', fontWeight: 800, textDecoration: 'none' }}>🔥 Explore Market</Link>
            <Link href="/create-event" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid white', padding: '16px 32px', borderRadius: '50px', fontWeight: 700, textDecoration: 'none' }}>➕ Create Event</Link>
          </div>
        </div>
      </div>

      {/* 3. MAIN LAYOUT: BROWSE SECTION */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: isMobile ? '40px 16px' : '60px 48px',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '260px 1fr',
        gap: '40px'
      }}>

        {/* SIDEBAR FILTER (Responsive) */}
        <aside style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'row' : 'column', 
            gap: '12px',
            overflowX: isMobile ? 'auto' : 'visible',
            paddingBottom: isMobile ? '20px' : '0',
            position: isMobile ? 'static' : 'sticky',
            top: '100px',
            whiteSpace: 'nowrap'
        }}>
            <h3 style={{ display: isMobile ? 'none' : 'block', fontSize: '18px', fontWeight: 800, marginBottom: '10px' }}>Filter by</h3>
            {['all', 'Music', 'Tech', 'Art', 'Sports'].map((cat) => (
                <button 
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    style={{
                        padding: '10px 20px',
                        borderRadius: '50px',
                        border: '1px solid #E8E4F5',
                        background: activeFilter === cat ? '#7C3AED' : 'white',
                        color: activeFilter === cat ? 'white' : '#4B4869',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontSize: '13px'
                    }}
                >
                    {cat.toUpperCase()}
                </button>
            ))}
        </aside>

        {/* CONTENT AREA: EVENT GRID */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
             <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Live on Blockchain</h2>
             <span style={{ fontSize: '14px', color: '#9896B0' }}>{eventCount?.toString() || '0'} Events</span>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', 
            gap: '24px' 
          }}>
            {/* 4. LOOP DATA ASLI (Sama seperti Market) */}
            {eventCount && Number(eventCount) > 0 ? (
                Array.from({ length: Number(eventCount) }).map((_, i) => (
                    <div key={i} style={{ background: 'white', borderRadius: '24px', border: '1px solid #E8E4F5', overflow: 'hidden' }}>
                         <div style={{ height: '140px', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px' }}>🎫</div>
                         <div style={{ padding: '20px' }}>
                             <div style={{ fontWeight: 800, fontSize: '18px' }}>Event #{i + 1}</div>
                             <p style={{ color: '#9896B0', fontSize: '13px' }}>Official NFT Ticket</p>
                             <Link href="/market" style={{ display: 'block', marginTop: '15px', textAlign: 'center', background: '#F3F0FF', color: '#7C3AED', padding: '10px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>View Details</Link>
                         </div>
                    </div>
                ))
            ) : (
                <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', background: 'white', borderRadius: '24px', border: '1px dashed #E8E4F5' }}>
                    <p style={{ color: '#9896B0' }}>No live events yet. Be the first creator!</p>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. FOOTER (Responsive) */}
      <footer style={{ background: '#0F0A1E', color: 'white', padding: isMobile ? '40px 20px' : '80px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: '40px' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '24px', marginBottom: '16px' }}>Ticket<span style={{ color: '#7C3AED' }}>Pro</span></div>
            <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '300px' }}>The world's first decentralized ticketing platform for the next generation of events.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
             <div>
                <h4 style={{ marginBottom: '16px' }}>Platform</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', opacity: 0.6 }}>
                    <Link href="/market" style={{ color: 'white', textDecoration: 'none' }}>Marketplace</Link>
                    <Link href="/create-event" style={{ color: 'white', textDecoration: 'none' }}>Create Event</Link>
                </div>
             </div>
             <div>
                <h4 style={{ marginBottom: '16px' }}>Verify</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', opacity: 0.6 }}>
                    <Link href="/verify" style={{ color: 'white', textDecoration: 'none' }}>Check Ticket</Link>
                    <Link href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
                </div>
             </div>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '40px auto 0', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
            © 2026 TicketPro Ecosystem. Built on Ethereum Sepolia.
        </div>
      </footer>

    </main>
  )
}