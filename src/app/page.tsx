'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useBalance } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function DashboardLayout() {
  const { address, isConnected } = useAccount()
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard') // State untuk ganti-ganti menu

  // Ambil Saldo & Tiket
  const { data: balanceData } = useBalance({ address })
  const { data: myTickets } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getTicketsByOwner',
    args: address ? [address] : undefined,
  })

  // Deteksi Layar HP
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!isConnected) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#FAFAFF' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔐</div>
        <h2 style={{ fontWeight: 800, color: '#0F0A1E', marginBottom: '20px' }}>Please connect your wallet</h2>
        <ConnectButton />
        <Link href="/" style={{ marginTop: '20px', color: '#7C3AED', fontWeight: 600, textDecoration: 'none' }}>← Back to Home</Link>
      </div>
    )
  }

  // --- KOMPONEN SIDEBAR ITEM ---
  const SidebarItem = ({ icon, label, tabId, isLink = false, linkUrl = "/" }: any) => {
    const isActive = activeTab === tabId;
    
    // Jika ini link biasa (pindah halaman)
    if (isLink) {
      return (
        <Link href={linkUrl} style={{
          display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
          borderRadius: '12px', textDecoration: 'none', color: '#4B4869',
          fontWeight: 600, marginBottom: '4px', transition: 'all 0.2s'
        }}>
          <span style={{ fontSize: '18px' }}>{icon}</span>
          <span style={{ fontSize: '14px' }}>{label}</span>
        </Link>
      )
    }

    // Jika ini Tab di dalam Dashboard
    return (
      <button 
        onClick={() => setActiveTab(tabId)} 
        style={{
          display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
          borderRadius: '12px', textDecoration: 'none', width: '100%', border: 'none',
          background: isActive ? '#F3F0FF' : 'transparent',
          color: isActive ? '#7C3AED' : '#4B4869',
          fontWeight: isActive ? 700 : 600, cursor: 'pointer',
          marginBottom: '4px', transition: 'all 0.2s', fontFamily: 'inherit', textAlign: 'left'
        }}
      >
        <span style={{ fontSize: '18px' }}>{icon}</span>
        <span style={{ fontSize: '14px' }}>{label}</span>
      </button>
    )
  }

  // --- KONTEN: DASHBOARD UTAMA ---
  const renderDashboardHome = () => (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #E8E4F5' }}>
          <div style={{ fontSize: '20px', marginBottom: '16px' }}>🎫</div>
          <div style={{ fontSize: '28px', fontWeight: 800 }}>{myTickets ? (myTickets as any).length : 0}</div>
          <div style={{ fontSize: '13px', color: '#9896B0' }}>My Tickets</div>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #E8E4F5' }}>
          <div style={{ fontSize: '20px', marginBottom: '16px' }}>💰</div>
          <div style={{ fontSize: '24px', fontWeight: 800 }}>{balanceData ? Number(balanceData.formatted).toFixed(4) : '0.00'} ETH</div>
          <div style={{ fontSize: '13px', color: '#9896B0' }}>Wallet Balance</div>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #E8E4F5' }}>
          <div style={{ fontSize: '20px', marginBottom: '16px' }}>❤️</div>
          <div style={{ fontSize: '28px', fontWeight: 800 }}>2</div>
          <div style={{ fontSize: '13px', color: '#9896B0' }}>Saved Events</div>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #E8E4F5' }}>
          <div style={{ fontSize: '20px', marginBottom: '16px' }}>⛓️</div>
          <div style={{ fontSize: '24px', fontWeight: 800 }}>Sepolia</div>
          <div style={{ fontSize: '13px', color: '#9896B0' }}>Network</div>
        </div>
      </div>
    </>
  )

  // --- KONTEN: SAVED EVENTS ---
  const renderSavedEvents = () => (
    <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E8E4F5', padding: '30px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>❤️ Saved Events</h2>
      <p style={{ color: '#9896B0' }}>You have 2 events in your wishlist.</p>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        {['Neon City Rave Vol. 3', 'Web3 Culture Festival'].map((name, i) => (
          <div key={i} style={{ border: '1px solid #E8E4F5', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div><div style={{ fontWeight: 700 }}>{name}</div><div style={{ fontSize: '12px', color: '#7C3AED' }}>Ticket available</div></div>
            <Link href="/market" style={{ padding: '8px 16px', background: '#F3F0FF', color: '#7C3AED', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '12px' }}>View</Link>
          </div>
        ))}
      </div>
    </div>
  )

  // --- KONTEN: UPCOMING TICKETS ---
  const renderUpcoming = () => (
    <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E8E4F5', padding: '30px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>🎟️ Upcoming Events</h2>
      {myTickets && (myTickets as any).length > 0 ? (
        <div style={{ display: 'grid', gap: '16px' }}>
          {(myTickets as any).map((ticket: any, i: number) => (
            <div key={i} style={{ background: '#FAFAFF', border: '1px solid #E8E4F5', borderRadius: '16px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F0A1E' }}>{ticket.eventName || `Ticket #${ticket.tokenId}`}</div>
                <div style={{ fontSize: '13px', color: '#9896B0', marginTop: '4px' }}>Valid for entry</div>
              </div>
              <button style={{ padding: '10px 20px', background: '#0F0A1E', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>Show QR</button>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: '#9896B0' }}>You don't have any upcoming events. Go mint some tickets!</p>
      )}
    </div>
  )

  // --- KONTEN: PROFILE & SETTINGS ---
  const renderProfile = () => (
    <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E8E4F5', padding: '30px', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>👤 Profile</h2>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Wallet Address</label>
        <input disabled value={address} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E8E4F5', background: '#FAFAFF', color: '#9896B0' }} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Username</label>
        <input placeholder="Enter username..." style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E8E4F5' }} />
      </div>
      <button style={{ padding: '14px 24px', background: '#7C3AED', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Save Changes</button>
    </div>
  )

  const renderSettings = () => (
    <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E8E4F5', padding: '30px', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>⚙️ Settings</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #E8E4F5' }}>
        <div><div style={{ fontWeight: 700 }}>Email Notifications</div><div style={{ fontSize: '12px', color: '#9896B0' }}>Get updates on new events</div></div>
        <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
        <div><div style={{ fontWeight: 700 }}>Dark Mode</div><div style={{ fontSize: '12px', color: '#9896B0' }}>Toggle application theme</div></div>
        <input type="checkbox" style={{ width: '20px', height: '20px' }} />
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFAFF', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      
      {/* ================= SIDEBAR (Sesuai Foto Kamu) ================= */}
      {!isMobile && (
        <aside style={{ width: '260px', background: 'white', borderRight: '1px solid #E8E4F5', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', top: 0, left: 0 }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #E8E4F5', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🎟️</div>
            <div style={{ fontWeight: 800, fontSize: '20px', color: '#0F0A1E' }}>Ticket<span style={{ color: '#7C3AED' }}>Pro</span></div>
          </div>

          <div style={{ padding: '20px 16px', flex: 1, overflowY: 'auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9896B0', marginBottom: '12px', paddingLeft: '16px', letterSpacing: '0.05em' }}>MENU</div>
            <SidebarItem icon="🏠" label="Dashboard" tabId="dashboard" />
            <SidebarItem icon="🔍" label="Explore Events" isLink={true} linkUrl="/" />
            <SidebarItem icon="❤️" label="Saved Events" tabId="saved" />

            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9896B0', margin: '24px 0 12px', paddingLeft: '16px', letterSpacing: '0.05em' }}>MY TICKETS</div>
            <SidebarItem icon="🎫" label="Upcoming Events" tabId="upcoming" />
            <SidebarItem icon="🕰️" label="Past Events" tabId="past" />

            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9896B0', margin: '24px 0 12px', paddingLeft: '16px', letterSpacing: '0.05em' }}>ACCOUNT</div>
            <SidebarItem icon="👤" label="Profile" tabId="profile" />
            <SidebarItem icon="⚙️" label="Settings" tabId="settings" />
          </div>
        </aside>
      )}

      {/* ================= KONTEN UTAMA ================= */}
      <main style={{ flex: 1, marginLeft: isMobile ? '0' : '260px', padding: isMobile ? '20px' : '40px' }}>
        
        {/* Header Bar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexDirection: isMobile ? 'column' : 'row', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0F0A1E', textTransform: 'capitalize' }}>
              {activeTab === 'dashboard' ? 'Overview' : activeTab.replace('-', ' ')}
            </h1>
            <p style={{ color: '#9896B0', fontSize: '14px', marginTop: '4px' }}>{address?.slice(0, 6)}...{address?.slice(-4)}</p>
          </div>
          <ConnectButton />
        </header>

        {/* LOGIC RENDER TAB: Ganti konten berdasarkan menu yang diklik */}
        {activeTab === 'dashboard' && renderDashboardHome()}
        {activeTab === 'saved' && renderSavedEvents()}
        {activeTab === 'upcoming' && renderUpcoming()}
        {activeTab === 'past' && <div style={{ color: '#9896B0', padding: '40px', background: 'white', borderRadius: '24px', textAlign: 'center' }}>No past events found.</div>}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'settings' && renderSettings()}

      </main>
    </div>
  )
}