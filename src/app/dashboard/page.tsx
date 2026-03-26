'use client'

export const dynamic = 'force-dynamic';

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useBalance } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import { QRCodeSVG } from 'qrcode.react'
import Navbar from '../components/Navbar'

// --- TICKET CARD COMPONENT ---
const TicketCard = ({ ticketId }: { ticketId: string }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  return (
    <div onClick={() => setIsFlipped(!isFlipped)} style={{ perspective: '1000px', width: '100%', height: '340px', cursor: 'pointer' }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)', transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
        <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', borderRadius: '24px', padding: '30px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 20px 40px rgba(124, 58, 237, 0.2)' }}>
          <div>
            <div style={{ display: 'inline-block', fontSize: '10px', fontWeight: 800, background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '50px', marginBottom: '15px' }}>OFFICIAL NFT 💎</div>
            <div style={{ fontSize: '26px', fontWeight: 800, lineHeight: 1.2 }}>VIP Access<br />Ticket #{ticketId}</div>
          </div>
          <div style={{ textAlign: 'center', fontSize: '13px', opacity: 0.8 }}>Tap to show QR Code 🔍</div>
        </div>
        <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: 'white', border: '2px solid #E8E4F5', borderRadius: '24px', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotateY(180deg)' }}>
          {/* Link ke halaman verifikasi menggunakan Token ID */}
          <QRCodeSVG value={`${window.location.origin}/verification?tokenId=${ticketId}`} size={150} />
          <div style={{ marginTop: '20px', fontWeight: 800 }}>Ticket #{ticketId}</div>
          <div style={{ fontSize: '12px', color: '#9896B0' }}>Scan at Event Gate 🎫</div>
        </div>
      </div>
    </div>
  )
}

const ToggleSwitch = ({ isOn, onToggle }: { isOn: boolean, onToggle: () => void }) => (
  <div onClick={onToggle} style={{ width: '44px', height: '24px', background: isOn ? '#7C3AED' : '#E8E4F5', borderRadius: '50px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}>
    <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: isOn ? '22px' : '2px', transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
  </div>
)

export default function DashboardPage() {
  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const [activeTab, setActiveTab] = useState('upcoming')
  const [username, setUsername] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [hideSpam, setHideSpam] = useState(true)
  const [testnetMode, setTestnetMode] = useState(true)

  const { data: myTickets, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getTicketsByOwner',
    args: address ? [address] : undefined,
  })

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize(); window.addEventListener('resize', handleResize)
    const savedName = localStorage.getItem('tp_username')
    if (savedName) setUsername(savedName)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!isConnected) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#FAFAFF' }}>
        <h2 style={{ fontWeight: 800, marginBottom: '20px' }}>Please connect your wallet 🔑</h2>
        <w3m-button />
      </div>
    )
  }

  // PENGAMAN: Pastikan data tiket selalu berupa array agar tidak crash saat .map
  const ticketList = Array.isArray(myTickets) ? myTickets : [];

  const SidebarItem = ({ label, tabId, icon, isLink = false, linkUrl = "/" }: any) => {
    const isActive = activeTab === tabId;
    return isLink ? (
      <Link href={linkUrl} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderRadius: '14px', textDecoration: 'none', color: '#4B4869', fontWeight: 600, marginBottom: '6px', transition: '0.2s' }}>
        <span style={{ fontSize: '18px' }}>{icon}</span> <span style={{ fontSize: '14px' }}>{label}</span>
      </Link>
    ) : (
      <button onClick={() => setActiveTab(tabId)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 20px', borderRadius: '14px', width: '100%', border: 'none', background: isActive ? '#F3F0FF' : 'transparent', color: isActive ? '#7C3AED' : '#4B4869', fontWeight: isActive ? 700 : 600, cursor: 'pointer', marginBottom: '6px', textAlign: 'left', transition: '0.2s' }}>
        <span style={{ fontSize: '18px' }}>{icon}</span> <span style={{ fontSize: '14px' }}>{label}</span>
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFAFF', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <aside style={{ width: '280px', background: 'white', borderRight: '1px solid #E8E4F5', display: isMobile ? 'none' : 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', zIndex: 10 }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #E8E4F5' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🎟️</div>
            <span style={{ fontWeight: 800, fontSize: '20px', color: '#0F0A1E' }}>Ticket<span style={{ color: '#7C3AED' }}>Pro</span></span>
          </Link>
        </div>

        <div style={{ padding: '24px 16px', flex: 1 }}>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#9896B0', marginBottom: '16px', paddingLeft: '16px', letterSpacing: '1px' }}>MAIN MENU</div>
          <SidebarItem label="My Collections" tabId="upcoming" icon="🖼️" />
          <SidebarItem label="My Earnings" tabId="earnings" icon="💰" />

          <div style={{ fontSize: '11px', fontWeight: 800, color: '#9896B0', margin: '32px 0 16px', paddingLeft: '16px', letterSpacing: '1px' }}>EXPLORE</div>
          <SidebarItem label="Market" isLink={true} linkUrl="/events" icon="🛍️" />
          <SidebarItem label="Verify Ticket" isLink={true} linkUrl="" /verify" icon="🛡️" />

          <div style={{ fontSize: '11px', fontWeight: 800, color: '#9896B0', margin: '32px 0 16px', paddingLeft: '16px', letterSpacing: '1px' }}>PERSONAL</div>
          <SidebarItem label="Profile" tabId="profile" icon="👤" />
          <SidebarItem label="Settings" tabId="settings" icon="⚙️" />
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: isMobile ? '0' : '280px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: isMobile ? '24px' : '48px', flex: 1 }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
            <div>
              <h1 style={{ fontSize: '32px', fontWeight: 800 }}>
                {activeTab === 'earnings' ? 'Financial Overview 💰' : activeTab === 'settings' ? 'Dashboard Settings ⚙️' : `Hello, ${username || 'Collector'} 👋`}
              </h1>
              <p style={{ color: '#9896B0', marginTop: '4px' }}>Welcome to your Web3 ticketing hub.</p>
            </div>
            <w3m-button />
          </header>

          {activeTab === 'upcoming' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #E8E4F5', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '13px', color: '#9896B0', fontWeight: 600 }}>Balance</div>
                  <div style={{ fontSize: '26px', fontWeight: 800, marginTop: '8px' }}>{balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.00 ETH'}</div>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #E8E4F5', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '13px', color: '#9896B0', fontWeight: 600 }}>Total NFTs</div>
                  <div style={{ fontSize: '26px', fontWeight: 800, marginTop: '8px' }}>{ticketList.length} Tickets</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                {isLoading ? (
                  <p>Loading your tickets... ⏳</p>
                ) : ticketList.length > 0 ? (
                  ticketList.map((id: any) => <TicketCard key={id.toString()} ticketId={id.toString()} />)
                ) : (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '80px', background: 'white', borderRadius: '32px', border: '2px dashed #E8E4F5' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>Empty 💨</div>
                    <p style={{ color: '#9896B0', marginBottom: '24px' }}>You haven't minted any tickets yet.</p>
                    <Link href="/events" style={{ background: '#7C3AED', color: 'white', padding: '14px 28px', borderRadius: '50px', textDecoration: 'none', fontWeight: 700 }}>Go to Market</Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ... SISA TAB EARNINGS, SETTINGS, PROFILE (Tetap Sama) ... */}
          {activeTab === 'earnings' && (
            <div style={{ maxWidth: '800px' }}>
              <div style={{ background: 'linear-gradient(135deg, #10B981, #059669)', padding: '40px', borderRadius: '32px', color: 'white', marginBottom: '32px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, opacity: 0.9 }}>Available for Withdrawal</div>
                <div style={{ fontSize: '42px', fontWeight: 800, margin: '12px 0' }}>1.24 ETH</div>
                <button style={{ background: 'white', color: '#059669', border: 'none', padding: '14px 28px', borderRadius: '14px', fontWeight: 800, cursor: 'pointer' }}>Withdraw to Wallet 🏦</button>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div style={{ background: 'white', padding: '40px', borderRadius: '32px', border: '1px solid #E8E4F5', maxWidth: '600px' }}>
              <h3 style={{ fontWeight: 800, marginBottom: '24px' }}>App Preferences</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #F3F0FF' }}>
                <div><div style={{ fontWeight: 700 }}>Testnet Mode ⛓️</div><div style={{ fontSize: '12px', color: '#9896B0' }}>Show data from Sepolia network.</div></div>
                <ToggleSwitch isOn={testnetMode} onToggle={() => setTestnetMode(!testnetMode)} />
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div style={{ background: 'white', padding: '40px', borderRadius: '32px', border: '1px solid #E8E4F5', maxWidth: '600px' }}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Display Name ✨</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Yudi Anto" style={{ width: '100%', padding: '16px', borderRadius: '14px', border: '1.5px solid #F3F0FF', outlineColor: '#7C3AED', fontSize: '16px' }} />
              </div>
              <button onClick={() => { localStorage.setItem('tp_username', username); alert('Profile updated! ✅'); }} style={{ width: '100%', padding: '16px', background: '#0F0A1E', color: 'white', borderRadius: '14px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Update Profile</button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}