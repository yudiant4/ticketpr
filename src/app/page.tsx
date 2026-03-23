'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import Navbar from './components/Navbar'
import { motion } from 'framer-motion' // Import Animasi

export default function LandingPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [activeFilter, setActiveFilter] = useState('all')

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
    <main style={{ background: '#FAFAFF', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <Navbar />

      {/* HERO SECTION DENGAN ANIMASI MUNCUL */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ 
          background: 'linear-gradient(135deg,#7C3AED,#A855F7,#EC4899)', 
          padding: isMobile ? '80px 20px' : '120px 48px', 
          position: 'relative', overflow: 'hidden' 
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1, textAlign: isMobile ? 'center' : 'left' }}>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            style={{ fontSize: isMobile ? '40px' : '72px', fontWeight: 800, color: 'white', lineHeight: 1, marginBottom: '24px' }}
          >
            Experience <br/> <span style={{ textShadow: '0 0 20px rgba(255,255,255,0.4)' }}>Future Events.</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ display: 'flex', gap: '16px', justifyContent: isMobile ? 'center' : 'flex-start', flexDirection: isMobile ? 'column' : 'row' }}
          >
            <Link href="/market" style={{ background: 'white', color: '#7C3AED', padding: '18px 40px', borderRadius: '50px', fontWeight: 800, textDecoration: 'none' }}>🔥 Start Exploring</Link>
          </motion.div>
        </div>
      </motion.section>

      {/* GRID EVENT DENGAN ANIMASI SATU PER SATU */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 20px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '40px' }}>Hot Events ⚡</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '30px' }}>
          {eventCount && Array.from({ length: Number(eventCount) }).map((_, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10, scale: 1.02 }} // Efek saat kursor di atas kartu
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }} // Muncul saat di-scroll
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }} // Muncul gantian (stagger)
              style={{ 
                background: 'white', borderRadius: '28px', border: '1px solid #E8E4F5', 
                overflow: 'hidden', boxShadow: '0 10px 30px rgba(124, 58, 237, 0.05)' 
              }}
            >
              <div style={{ height: '200px', background: 'linear-gradient(45deg, #7C3AED, #EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px' }}>🎫</div>
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontWeight: 800, fontSize: '20px' }}>Exclusive Ticket #{i+1}</h3>
                <p style={{ color: '#9896B0', marginTop: '8px' }}>Verified NFT on Sepolia Network</p>
                <Link href="/market" style={{ display: 'block', marginTop: '20px', textAlign: 'center', background: '#F3F0FF', color: '#7C3AED', padding: '12px', borderRadius: '14px', fontWeight: 700, textDecoration: 'none' }}>Mint Now</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  )
}