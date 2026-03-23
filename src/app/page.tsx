'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import Navbar from './components/Navbar'
import { motion } from 'framer-motion'
import Footer from './components/Footer' // 1. PASTIKAN TITIKNYA SATU (./)

export default function LandingPage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize(); window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const { data: eventCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'eventCount',
  })

  return (
    // TAMBAHKAN display flex & minHeight supaya footer terdorong ke bawah
    <main style={{ background: '#FAFAFF', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <Navbar />

      {/* BUNGKUS SEMUA KONTEN TENGAH DENGAN div style flex: 1 */}
      <div style={{ flex: 1 }}>
          {/* --- HERO SECTION --- */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              background: 'linear-gradient(135deg,#7C3AED,#EC4899)', 
              padding: isMobile ? '80px 20px' : '120px 48px', 
              color: 'white', position: 'relative', overflow: 'hidden' 
            }}
          >
            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
              <h1 style={{ fontSize: isMobile ? '40px' : '72px', fontWeight: 800 }}>Collect Memories.</h1>
              <p style={{ fontSize: '20px', opacity: 0.9, marginTop: '20px' }}>Platform NFT Tiket Masa Depan</p>
              <div style={{ marginTop: '40px', display: 'flex', gap: '15px' }}>
                <Link href="/market" style={{ background: 'white', color: '#7C3AED', padding: '16px 32px', borderRadius: '50px', fontWeight: 800, textDecoration: 'none' }}>🛒 Explore Market</Link>
              </div>
            </div>
          </motion.section>

          {/* --- EVENT GRID --- */}
          <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '40px' }}>Live Events ⚡</h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '30px' }}>
              {eventCount && Number(eventCount) > 0 ? (
                 <p>Ditemukan {eventCount.toString()} Event.</p>
              ) : (
                 <p style={{ color: '#9896B0' }}>No live events yet.</p>
              )}
            </div>
          </section>
      </div>

      {/* 2. INI KUNCINYA: TAG FOOTER HARUS DIPASANG DI SINI! */}
      <Footer />
    </main>
  )
}