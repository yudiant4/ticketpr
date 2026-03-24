'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { QRCodeSVG } from 'qrcode.react'

// ... Bagian TicketCard dan Toggle tetap sama (hanya pastikan emoji sudah hilang) ...

export default function DashboardLayout() {
  // ... State dan Hooks tetap sama ...

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFAFF', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

      {/* SIDEBAR */}
      <aside style={{ width: '260px', background: 'white', borderRight: '1px solid #E8E4F5', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', top: 0, left: 0, zIndex: 1000 }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #E8E4F5', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="url(#side-grad)" />
            <path d="M7 9H17M7 12H17M7 15H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
            <defs>
              <linearGradient id="side-grad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#7C3AED" /><stop offset="1" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
          <div style={{ fontWeight: 800, fontSize: '18px' }}>TicketPro</div>
        </div>

        <div style={{ padding: '20px 16px', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#9896B0', marginBottom: '12px', paddingLeft: '16px', letterSpacing: '1px' }}>MY TICKETS</div>
          {/* Item menu tanpa emoji */}
          <SidebarItem label="My NFTs" tabId="upcoming" />
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#9896B0', margin: '24px 0 12px', paddingLeft: '16px', letterSpacing: '1px' }}>CREATOR</div>
          <SidebarItem label="My Earnings" tabId="earnings" />
          {/* ... sisa menu ... */}
        </div>
      </aside>

      {/* Main Content tetap sama, pastikan teks header tanpa emoji */}
    </div>
  )
}