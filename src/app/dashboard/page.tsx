'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useBalance } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { QRCodeSVG } from 'qrcode.react';

export default function DashboardLayout() {
    const { address, isConnected } = useAccount()
    const [isMobile, setIsMobile] = useState(false)
    const [activeTab, setActiveTab] = useState('dashboard')
    const [isMenuOpen, setIsMenuOpen] = useState(false) // State untuk buka/tutup menu di HP

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [darkMode, setDarkMode] = useState(false)

    const { data: balanceData } = useBalance({ address })
    const { data: myTickets } = useReadContract({
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

    const SidebarItem = ({ icon, label, tabId, isLink = false, linkUrl = "/" }: any) => {
        const isActive = activeTab === tabId;
        const handleClick = () => {
            if (!isLink) {
                setActiveTab(tabId)
                if (isMobile) setIsMenuOpen(false) // Tutup menu otomatis setelah klik di HP
            }
        }

        if (isLink) {
            return (
                <Link href={linkUrl} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', textDecoration: 'none', color: '#4B4869', fontWeight: 600, marginBottom: '4px' }}>
                    <span style={{ fontSize: '18px' }}>{icon}</span><span style={{ fontSize: '14px' }}>{label}</span>
                </Link>
            )
        }
        return (
            <button onClick={handleClick} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', width: '100%', border: 'none', background: isActive ? '#F3F0FF' : 'transparent', color: isActive ? '#7C3AED' : '#4B4869', fontWeight: isActive ? 700 : 600, cursor: 'pointer', marginBottom: '4px', textAlign: 'left', fontFamily: 'inherit' }}>
                <span style={{ fontSize: '18px' }}>{icon}</span><span style={{ fontSize: '14px' }}>{label}</span>
            </button>
        )
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFAFF', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

            {/* ================= SIDEBAR (DESKTOP & MOBILE OVERLAY) ================= */}
            <aside style={{
                width: '260px',
                background: 'white',
                borderRight: '1px solid #E8E4F5',
                display: (isMobile && !isMenuOpen) ? 'none' : 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100vh',
                top: 0,
                left: 0,
                zIndex: 1000, // Supaya di atas konten lain
                boxShadow: isMobile ? '0 0 50px rgba(0,0,0,0.2)' : 'none'
            }}>
                {/* Header Sidebar dengan tombol close di HP */}
                <div style={{ padding: '24px', borderBottom: '1px solid #E8E4F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🎟️</div>
                        <div style={{ fontWeight: 800, fontSize: '18px' }}>TicketPro</div>
                    </div>
                    {isMobile && <button onClick={() => setIsMenuOpen(false)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>}
                </div>

                {/* Menu Items */}
                <div style={{ padding: '20px 16px', flex: 1, overflowY: 'auto' }}>
                    <SidebarItem icon="🏠" label="Dashboard" tabId="dashboard" />
                    <SidebarItem icon="🔍" label="Explore Events" isLink={true} linkUrl="/" />
                    <SidebarItem icon="👤" label="Profile" tabId="profile" />
                    <SidebarItem icon="⚙️" label="Settings" tabId="settings" />
                </div>
            </aside>

            {/* ================= MAIN CONTENT ================= */}
            <main style={{ flex: 1, marginLeft: isMobile ? '0' : '260px', padding: isMobile ? '20px' : '40px' }}>

                {/* TOP BAR DENGAN HAMBURGER DI HP */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {isMobile && (
                            <button onClick={() => setIsMenuOpen(true)} style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '10px', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer' }}>☰</button>
                        )}
                        <div>
                            <h1 style={{ fontSize: isMobile ? '20px' : '28px', fontWeight: 800 }}>Welcome, {username || 'User'}!</h1>
                        </div>
                    </div>
                    <ConnectButton showBalance={!isMobile} />
                </header>

                {/* KONTEN BERDASARKAN TAB */}
                {activeTab === 'dashboard' && (
                    <>
                        {/* STATS GRID */}
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
                            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #E8E4F5' }}>
                                <div style={{ fontSize: '12px', color: '#9896B0', marginBottom: '8px' }}>My Tickets</div>
                                <div style={{ fontSize: '24px', fontWeight: 800 }}>{myTickets ? (myTickets as any).length : 0}</div>
                            </div>
                            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #E8E4F5' }}>
                                <div style={{ fontSize: '12px', color: '#9896B0', marginBottom: '8px' }}>Balance</div>
                                <div style={{ fontSize: '20px', fontWeight: 800 }}>{balanceData ? Number(balanceData.formatted).toFixed(3) : '0'} ETH</div>
                            </div>
                            {!isMobile && (
                                <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #E8E4F5' }}>
                                    <div style={{ fontSize: '12px', color: '#9896B0', marginBottom: '8px' }}>Network</div>
                                    <div style={{ fontSize: '20px', fontWeight: 800 }}>Sepolia</div>
                                </div>
                            )}
                        </div>

                        {/* QUICK ACTIONS */}
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '15px' }}>
                            <Link href="/market" style={{ background: 'white', border: '1px solid #E8E4F5', padding: '20px', borderRadius: '16px', textDecoration: 'none', textAlign: 'center' }}>
                                <div style={{ fontSize: '24px' }}>🛒</div>
                                <div style={{ fontWeight: 700, fontSize: '13px', color: '#0F0A1E', marginTop: '10px' }}>Market</div>
                            </Link>
                            <Link href="/create-event" style={{ background: 'white', border: '1px solid #E8E4F5', padding: '20px', borderRadius: '16px', textDecoration: 'none', textAlign: 'center' }}>
                                <div style={{ fontSize: '24px' }}>➕</div>
                                <div style={{ fontWeight: 700, fontSize: '13px', color: '#0F0A1E', marginTop: '10px' }}>Create</div>
                            </Link>
                            <Link href="/verify" style={{ background: 'white', border: '1px solid #E8E4F5', padding: '20px', borderRadius: '16px', textDecoration: 'none', textAlign: 'center' }}>
                                <div style={{ fontSize: '24px' }}>🛡️</div>
                                <div style={{ fontWeight: 700, fontSize: '13px', color: '#0F0A1E', marginTop: '10px' }}>Verify</div>
                            </Link>
                            <button onClick={() => setActiveTab('profile')} style={{ background: 'white', border: '1px solid #E8E4F5', padding: '20px', borderRadius: '16px', textDecoration: 'none', textAlign: 'center', cursor: 'pointer', fontFamily: 'inherit' }}>
                                <div style={{ fontSize: '24px' }}>👤</div>
                                <div style={{ fontWeight: 700, fontSize: '13px', color: '#0F0A1E', marginTop: '10px' }}>Profile</div>
                            </button>
                        </div>

                        {/* ================= BAGIAN TIKET SAYA (UPCOMING TICKETS) ================= */}
                        <div style={{ marginTop: '40px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                🎫 My Upcoming Tickets
                            </h2>
                            {myTickets && (myTickets as any).length > 0 ? (
                                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '20px' }}>
                                    {(myTickets as any).map((ticket: any, i: number) => (
                                        <div key={i} style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #E8E4F5', textAlign: 'center' }}>
                                            <div style={{ background: 'white', padding: '15px', borderRadius: '15px', display: 'inline-block', marginBottom: '15px', border: '1px solid #F3F0FF' }}>
                                                {/* QR CODE BERDASARKAN ID TIKET */}
                                                <QRCodeSVG value={ticket.toString()} size={140} />
                                            </div>
                                            <div style={{ fontWeight: 800, fontSize: '16px', color: '#0F0A1E' }}>Ticket #{ticket.toString()}</div>
                                            <div style={{ fontSize: '12px', color: '#7C3AED', marginTop: '4px', fontWeight: 600 }}>Authentic NFT Ticket</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ background: 'white', padding: '40px', borderRadius: '20px', border: '1px solid #E8E4F5', textAlign: 'center' }}>
                                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>📭</div>
                                    <p style={{ color: '#9896B0' }}>You don't have any tickets yet.</p>
                                    <Link href="/market" style={{ color: '#7C3AED', fontWeight: 700, textDecoration: 'none', display: 'inline-block', marginTop: '10px' }}>Browse Marketplace →</Link>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* PROFILE TAB */}
                {activeTab === 'profile' && (
                    <div style={{ background: 'white', padding: '30px', borderRadius: '20px', border: '1px solid #E8E4F5', maxWidth: '500px' }}>
                        <h2 style={{ fontWeight: 800, marginBottom: '20px' }}>👤 Profile Settings</h2>
                        <label style={{ fontSize: '13px', fontWeight: 700 }}>Display Name</label>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #E8E4F5', marginTop: '8px', marginBottom: '20px' }}
                        />
                        <button onClick={() => { localStorage.setItem('tp_username', username); alert('Saved!'); }} style={{ background: '#7C3AED', color: 'white', padding: '12px 24px', borderRadius: '10px', border: 'none', fontWeight: 700 }}>Save Profile</button>
                    </div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === 'settings' && (
                    <div style={{ background: 'white', padding: '30px', borderRadius: '20px', border: '1px solid #E8E4F5', maxWidth: '500px' }}>
                        <h2 style={{ fontWeight: 800, marginBottom: '20px' }}>⚙️ App Settings</h2>
                        <p style={{ color: '#9896B0' }}>Notification and theme settings will appear here.</p>
                    </div>
                )}

            </main>

            {/* OVERLAY HITAM SAAT MENU BUKA DI HP */}
            {isMobile && isMenuOpen && (
                <div onClick={() => setIsMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} />
            )}
        </div>
    )
}