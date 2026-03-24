'use client'

export const dynamic = 'force-dynamic';

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useBalance } from 'wagmi' // Tambah useBalance
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import { QRCodeSVG } from 'qrcode.react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

// --- TICKET CARD FLIP ---
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
          <QRCodeSVG value={ticketId} size={150} />
          <div style={{ marginTop: '20px', fontWeight: 800, color: '#0F0A1E' }}>Ticket #{ticketId}</div>
          <div style={{ fontSize: '12px', color: '#9896B0', marginTop: '4px' }}>Scan at Gate 🎫</div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { address, isConnected, chain } = useAccount()
  const { data: balance } = useBalance({ address }) // MENGAMBIL SALDO ASLI
  const [activeTab, setActiveTab] = useState('upcoming')
  const [username, setUsername] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  // Fungsi untuk memendekkan alamat wallet (Contoh: 0x123...456)
  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const { data: myTickets } = useReadContract({
    address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'getTicketsByOwner', args: address ? [address] : undefined,
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
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#FAFAFF', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        <div style={{ fontSize: '50px' }}>🔑</div>
        <h2 style={{ fontWeight: 800, margin: '20px 0' }}>Please connect your wallet</h2>
        <w3m-button />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFAFF', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      
      {/* SIDEBAR */}
      <aside style={{ width: '280px', background: 'white', borderRight: '1px solid #E8E4F5', display: isMobile ? 'none' : 'flex', flexDirection: 'column', position: 'fixed', height: '100vh' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #E8E4F5' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🎟️</div>
            <span style={{ fontWeight: 800, fontSize: '20px', color: '#0F0A1E' }}>Ticket<span style={{ color: '#7C3AED' }}>Pro</span></span>
          </Link>
        </div>
        <div style={{ padding: '20px 16px', flex: 1 }}>
          <button onClick={() => setActiveTab('upcoming')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', width: '100%', border: 'none', background: activeTab === 'upcoming' ? '#F3F0FF' : 'transparent', color: activeTab === 'upcoming' ? '#7C3AED' : '#4B4869', fontWeight: 700, cursor: 'pointer', marginBottom: '4px' }}>🖼️ My NFTs</button>
          <button onClick={() => setActiveTab('profile')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', width: '100%', border: 'none', background: activeTab === 'profile' ? '#F3F0FF' : 'transparent', color: activeTab === 'profile' ? '#7C3AED' : '#4B4869', fontWeight: 700, cursor: 'pointer', marginBottom: '4px' }}>👤 Profile</button>
          <Link href="/market" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', textDecoration: 'none', color: '#4B4869', fontWeight: 600 }}>🛒 Marketplace</Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, marginLeft: isMobile ? '0' : '280px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: isMobile ? '20px' : '40px', flex: 1 }}>
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 800 }}>
                Welcome, {username || truncateAddress(address as string)} 👋
              </h1>
              <p style={{ color: '#9896B0', fontSize: '14px' }}>Manage your digital assets and account</p>
            </div>
            <w3m-button />
          </header>

          {activeTab === 'upcoming' && (
            <div>
              {/* STATS REAL DARI WALLET */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #E8E4F5' }}>
                  <div style={{ fontSize: '13px', color: '#9896B0', fontWeight: 600 }}>Real Balance 💰</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '5px' }}>
                    {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.00 ETH'}
                  </div>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #E8E4F5' }}>
                  <div style={{ fontSize: '13px', color: '#9896B0', fontWeight: 600 }}>Tickets Owned 🎫</div>
                  <div style={{ fontSize: '24px', fontWeight: 800, marginTop: '5px' }}>{(myTickets as any)?.length || 0} Items</div>
                </div>
                <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #E8E4F5' }}>
                  <div style={{ fontSize: '13px', color: '#9896B0', fontWeight: 600 }}>Network ⛓️</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, marginTop: '5px', color: '#10B981' }}>{chain?.name || 'Unknown'}</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                {myTickets && (myTickets as any).length > 0 ? (
                  (myTickets as any).map((id: any) => <TicketCard key={id.toString()} ticketId={id.toString()} />)
                ) : (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', background: 'white', borderRadius: '24px', border: '2px dashed #E8E4F5' }}>
                    <p>No tickets found in your wallet 💨</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div style={{ background: 'white', padding: '40px', borderRadius: '32px', border: '1px solid #E8E4F5', maxWidth: '600px' }}>
              <h2 style={{ marginBottom: '24px', fontWeight: 800 }}>My Profile 👤</h2>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Connected Address 🔑</label>
                <input disabled value={address} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #F3F0FF', background: '#FAFAFF', color: '#9896B0', fontSize: '14px' }} />
              </div>
              <div style={{ marginBottom: '30px' }}>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Custom Username ✨</label>
                <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. Yudi Anto" style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px solid #F3F0FF', outlineColor: '#7C3AED' }} />
              </div>
              <button onClick={() => { localStorage.setItem('tp_username', username); alert('Profile Saved! ✅'); }} style={{ width: '100%', padding: '16px', background: '#0F0A1E', color: 'white', borderRadius: '14px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Save Changes</button>
            </div>
          )}
        </div>
        <Footer />
      </main>
    </div>
  )
}