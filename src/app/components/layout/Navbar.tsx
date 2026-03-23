'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [isMobile, setIsMobile] = useState(false)

  // Deteksi ukuran layar secara otomatis
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize() // Jalankan saat pertama load
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isActive = (path: string) => pathname === path

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 100,
      padding: isMobile ? '12px 16px' : '0 48px',
      height: isMobile ? 'auto' : '72px',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row', // Tumpuk ke bawah kalau di HP
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #E8E4F5',
      gap: isMobile ? '12px' : '0'
    }}>

      {/* BARIS 1: LOGO & WALLET (Di HP mereka sejajar) */}
      <div style={{
        display: 'flex',
        width: isMobile ? '100%' : 'auto',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          fontWeight: 800, fontSize: '18px', color: '#0F0A1E', textDecoration: 'none'
        }}>
          <div style={{
            width: '30px', height: '30px',
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            borderRadius: '8px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '14px'
          }}>🎟️</div>
          Ticket<span style={{ color: '#7C3AED' }}>Pro</span>
        </Link>

        {/* Connect Button muncul di pojok kanan kalau di HP */}
        {isMobile && <ConnectButton showBalance={false} chainStatus="none" accountStatus="avatar" />}
      </div>

      {/* BARIS 2: SEARCH (Di HP jadi lebar penuh) */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        background: '#FAFAFF', border: '1px solid #E8E4F5',
        borderRadius: '50px', padding: '8px 16px',
        width: isMobile ? '100%' : '240px'
      }}>
        <span style={{ fontSize: '14px' }}>🔍</span>
        <input type="text" placeholder="Search..."
          style={{
            border: 'none', background: 'none', fontSize: '13px',
            outline: 'none', width: '100%', fontFamily: 'inherit'
          }} />
      </div>

      {/* BARIS 3: MENU LINKS */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: isMobile ? '16px' : '24px',
        overflowX: isMobile ? 'auto' : 'visible', // Bisa digeser kiri-kanan kalau kepanjangan di HP
        width: isMobile ? '100%' : 'auto',
        paddingBottom: isMobile ? '8px' : '0',
        justifyContent: isMobile ? 'flex-start' : 'flex-end',
        whiteSpace: 'nowrap' // Agar tulisan tidak turun ke bawah
      }}>
        <Link href="/dashboard" style={{ fontSize: '13px', fontWeight: isActive('/dashboard') ? 800 : 500, color: isActive('/dashboard') ? '#7C3AED' : '#4B4869', textDecoration: 'none' }}>Dashboard</Link>
        <Link href="/create-event" style={{ fontSize: '13px', fontWeight: isActive('/create-event') ? 800 : 500, color: isActive('/create-event') ? '#7C3AED' : '#4B4869', textDecoration: 'none' }}>Create</Link>
        <Link href="/market" style={{ fontSize: '13px', fontWeight: isActive('/market') ? 800 : 500, color: isActive('/market') ? '#7C3AED' : '#4B4869', textDecoration: 'none' }}>Market</Link>
        <Link href="/verify" style={{ fontSize: '13px', fontWeight: isActive('/verify') ? 800 : 500, color: isActive('/verify') ? '#7C3AED' : '#4B4869', textDecoration: 'none' }}>Verify</Link>

        {/* Connect Button versi Desktop */}
        {!isMobile && <ConnectButton />}
      </div>

    </nav>
  )
}