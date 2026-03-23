'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useBalance } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function DashboardLayout() {
  const { address, isConnected } = useAccount()
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')

  // === STATE UNTUK PROFILE & SETTINGS ===
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  // Ambil data blockchain
  const { data: balanceData } = useBalance({ address })
  const { data: myTickets } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getTicketsByOwner',
    args: address ? [address] : undefined,
  })

  // === EFEK: LOAD DATA DARI BROWSER (LOCAL STORAGE) ===
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize(); window.addEventListener('resize', handleResize)

    // Load Profile
    const savedName = localStorage.getItem('tp_username')
    const savedEmail = localStorage.getItem('tp_email')
    if (savedName) setUsername(savedName)
    if (savedEmail) setEmail(savedEmail)

    // Load Settings
    const savedDark = localStorage.getItem('tp_darkmode') === 'true'
    const savedNotif = localStorage.getItem('tp_notif') !== 'false' // default true
    setDarkMode(savedDark)
    setNotifications(savedNotif)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // === EFEK: TERAPKAN DARK MODE ===
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-theme')
    } else {
      document.documentElement.classList.remove('dark-theme')
    }
  }, [darkMode])

  // === FUNGSI: SIMPAN PROFILE DENGAN LOADING ===
  const handleSaveProfile = () => {
    setIsSaving(true) // Nyalakan loading spinner
    
    // Kita buat delay pura-pura 1.5 detik biar kerasa lagi nge-save ke server
    setTimeout(() => {
      localStorage.setItem('tp_username', username)
      localStorage.setItem('tp_email', email)
      setIsSaving(false) // Matikan spinner
      alert('✅ Profile saved successfully!')
    }, 1500)
  }

  // === FUNGSI: SIMPAN SETTINGS ===
  const toggleDarkMode = () => {
    const newVal = !darkMode
    setDarkMode(newVal)
    localStorage.setItem('tp_darkmode', newVal.toString())
  }

  const toggleNotif = () => {
    const newVal = !notifications
    setNotifications(newVal)
    localStorage.setItem('tp_notif', newVal.toString())
  }

  if (!isConnected) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#FAFAFF' }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔐</div>
        <h2 style={{ fontWeight: 800, color: '#0F0A1E', marginBottom: '20px' }}>Please connect your wallet</h2>
        <ConnectButton />
      </div>
    )
  }

  // Komponen Sidebar Item (Sama seperti sebelumnya)
  const SidebarItem = ({ icon, label, tabId, isLink = false, linkUrl = "/" }: any) => {
    const isActive = activeTab === tabId;
    if (isLink) {
      return (
        <Link href={linkUrl} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', textDecoration: 'none', color: '#4B4869', fontWeight: 600, marginBottom: '4px' }}>
          <span style={{ fontSize: '18px' }}>{icon}</span><span style={{ fontSize: '14px' }}>{label}</span>
        </Link>
      )
    }
    return (
      <button onClick={() => setActiveTab(tabId)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', textDecoration: 'none', width: '100%', border: 'none', background: isActive ? '#F3F0FF' : 'transparent', color: isActive ? '#7C3AED' : '#4B4869', fontWeight: isActive ? 700 : 600, cursor: 'pointer', marginBottom: '4px', textAlign: 'left' }}>
        <span style={{ fontSize: '18px' }}>{icon}</span><span style={{ fontSize: '14px' }}>{label}</span>
      </button>
    )
  }

  // --- KONTEN: PROFILE (SEKARANG BISA DI-SAVE) ---
  const renderProfile = () => (
    <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E8E4F5', padding: '30px', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>👤 Edit Profile</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Wallet Address (Read Only)</label>
        <input disabled value={address} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E8E4F5', background: '#FAFAFF', color: '#9896B0', cursor: 'not-allowed' }} />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Username</label>
        <input 
          value={username} 
          onChange={(e) => setUsername(e.target.value)}
          placeholder="e.g. yudiant4" 
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E8E4F5', outlineColor: '#7C3AED' }} 
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '8px' }}>Email Address</label>
        <input 
          type="email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com" 
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E8E4F5', outlineColor: '#7C3AED' }} 
        />
      </div>

      <button 
        onClick={handleSaveProfile}
        disabled={isSaving}
        style={{ padding: '14px 32px', background: isSaving ? '#A855F7' : '#7C3AED', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: isSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
      >
        {isSaving ? (
          <>
            <svg style={{ animation: 'spin 1s linear infinite', width: '20px', height: '20px', color: 'white' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" opacity="0.3"></circle>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Saving...
          </>
        ) : 'Save Changes'}
      </button>
    </div>
  )

  // --- KONTEN: SETTINGS (TOGGLE AKTIF) ---
  const renderSettings = () => (
    <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E8E4F5', padding: '30px', maxWidth: '600px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px' }}>⚙️ App Settings</h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #E8E4F5' }}>
        <div>
          <div style={{ fontWeight: 700 }}>Email Notifications</div>
          <div style={{ fontSize: '12px', color: '#9896B0', marginTop: '4px' }}>Get updates when your event tickets are minted</div>
        </div>
        {/* Toggle Custom */}
        <div onClick={toggleNotif} style={{ width: '44px', height: '24px', background: notifications ? '#10B981' : '#E8E4F5', borderRadius: '50px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}>
          <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: notifications ? '22px' : '2px', transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
        <div>
          <div style={{ fontWeight: 700 }}>Dark Mode (Preview)</div>
          <div style={{ fontSize: '12px', color: '#9896B0', marginTop: '4px' }}>Switch dashboard theme to dark mode</div>
        </div>
        {/* Toggle Custom */}
        <div onClick={toggleDarkMode} style={{ width: '44px', height: '24px', background: darkMode ? '#7C3AED' : '#E8E4F5', borderRadius: '50px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}>
          <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: darkMode ? '22px' : '2px', transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg2, #FAFAFF)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      
      {/* SIDEBAR */}
      {!isMobile && (
        <aside style={{ width: '260px', background: 'white', borderRight: '1px solid #E8E4F5', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', top: 0, left: 0 }}>
          <div style={{ padding: '24px', borderBottom: '1px solid #E8E4F5', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🎟️</div>
            <div style={{ fontWeight: 800, fontSize: '20px', color: '#0F0A1E' }}>Ticket<span style={{ color: '#7C3AED' }}>Pro</span></div>
          </div>
          <div style={{ padding: '20px 16px', flex: 1, overflowY: 'auto' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9896B0', marginBottom: '12px', paddingLeft: '16px' }}>MENU</div>
            <SidebarItem icon="🏠" label="Dashboard" tabId="dashboard" />
            <SidebarItem icon="🔍" label="Explore Events" isLink={true} linkUrl="/" />
            
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9896B0', margin: '24px 0 12px', paddingLeft: '16px' }}>MY TICKETS</div>
            <SidebarItem icon="🎫" label="Upcoming Events" tabId="upcoming" />
            
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#9896B0', margin: '24px 0 12px', paddingLeft: '16px' }}>ACCOUNT</div>
            <SidebarItem icon="👤" label="Profile" tabId="profile" />
            <SidebarItem icon="⚙️" label="Settings" tabId="settings" />
          </div>
        </aside>
      )}

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, marginLeft: isMobile ? '0' : '260px', padding: isMobile ? '20px' : '40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexDirection: isMobile ? 'column' : 'row', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#0F0A1E', textTransform: 'capitalize' }}>
              {activeTab === 'dashboard' ? `Welcome, ${username || 'User'}!` : activeTab}
            </h1>
            <p style={{ color: '#9896B0', fontSize: '14px', marginTop: '4px' }}>{address?.slice(0, 6)}...{address?.slice(-4)}</p>
          </div>
          <ConnectButton />
        </header>

        {activeTab === 'dashboard' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '20px' }}>
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
              <div style={{ fontSize: '20px', marginBottom: '16px' }}>⛓️</div>
              <div style={{ fontSize: '24px', fontWeight: 800 }}>Sepolia</div>
              <div style={{ fontSize: '13px', color: '#9896B0' }}>Network</div>
            </div>
          </div>
        )}
        
        {activeTab === 'upcoming' && <div style={{ background: 'white', padding: '30px', borderRadius: '24px', border: '1px solid #E8E4F5' }}>Coming Soon...</div>}
        {activeTab === 'profile' && renderProfile()}
        {activeTab === 'settings' && renderSettings()}
      </main>
    </div>
  )
}