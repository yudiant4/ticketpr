'use client'

// Wajib untuk aplikasi Web3 di Vercel
export const dynamic = 'force-dynamic';

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import { QRCodeSVG } from 'qrcode.react'
import Footer from '../components/Footer' // Tambahkan Footer

const TicketCard = ({ ticketId }: { ticketId: string }) => {
    const [isFlipped, setIsFlipped] = useState(false)

    return (
        <div onClick={() => setIsFlipped(!isFlipped)} style={{ perspective: '1000px', width: '100%', height: '340px', cursor: 'pointer' }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)', transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                {/* Depan */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', borderRadius: '24px', padding: '30px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 20px 40px rgba(124, 58, 237, 0.2)' }}>
                    <div>
                        <div style={{ display: 'inline-block', fontSize: '10px', fontWeight: 800, background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '50px', marginBottom: '15px' }}>OFFICIAL TICKET 💎</div>
                        <div style={{ fontSize: '26px', fontWeight: 800 }}>VIP Entry<br />Ticket #{ticketId}</div>
                    </div>
                    <div style={{ textAlign: 'center', fontSize: '13px', opacity: 0.8 }}>Tap to show QR Code 🔍</div>
                </div>
                {/* Belakang */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: 'white', border: '2px solid #E8E4F5', borderRadius: '24px', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotateY(180deg)' }}>
                    <QRCodeSVG value={ticketId} size={150} />
                    <div style={{ marginTop: '20px', fontWeight: 800 }}>Ticket #{ticketId}</div>
                    <div style={{ fontSize: '12px', color: '#9896B0' }}>Verified on Talus Network ⛓️</div>
                </div>
            </div>
        </div>
    )
}

export default function DashboardLayout() {
    const { address, isConnected } = useAccount()
    const [activeTab, setActiveTab] = useState('upcoming')
    const [username, setUsername] = useState('')

    // Ambil Tiket dari Contract
    const { data: myTickets } = useReadContract({
        address: CONTRACT_ADDRESS, abi: CONTRACT_ABI, functionName: 'getTicketsByOwner', args: address ? [address] : undefined,
    })

    useEffect(() => {
        const savedName = localStorage.getItem('tp_username')
        if (savedName) setUsername(savedName)
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

    const SidebarItem = ({ label, tabId, icon, isLink = false, linkUrl = "/" }: any) => {
        const isActive = activeTab === tabId;
        return isLink ? (
            <Link href={linkUrl} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', textDecoration: 'none', color: '#4B4869', fontWeight: 600, marginBottom: '4px' }}>
                <span>{icon}</span> <span style={{ fontSize: '14px' }}>{label}</span>
            </Link>
        ) : (
            <button onClick={() => setActiveTab(tabId)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', width: '100%', border: 'none', background: isActive ? '#F3F0FF' : 'transparent', color: isActive ? '#7C3AED' : '#4B4869', fontWeight: isActive ? 700 : 600, cursor: 'pointer', marginBottom: '4px', textAlign: 'left', fontFamily: 'inherit' }}>
                <span>{icon}</span> <span style={{ fontSize: '14px' }}>{label}</span>
            </button>
        )
    }

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFAFF', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>

            {/* SIDEBAR DENGAN LOGO BARU */}
            <aside style={{ width: '280px', background: 'white', borderRight: '1px solid #E8E4F5', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #E8E4F5' }}>
                    <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🎟️</div>
                        <span style={{ fontWeight: 800, fontSize: '20px', color: '#0F0A1E' }}>Ticket<span style={{ color: '#7C3AED' }}>Pro</span></span>
                    </Link>
                </div>

                <div style={{ padding: '20px 16px', flex: 1 }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#9896B0', marginBottom: '12px', paddingLeft: '16px' }}>MENU</div>
                    <SidebarItem label="My Collections" tabId="upcoming" icon="🖼️" />
                    <SidebarItem label="My Earnings" tabId="earnings" icon="💰" />
                    <SidebarItem label="Marketplace" isLink={true} linkUrl="/market" icon="🛒" />

                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#9896B0', margin: '24px 0 12px', paddingLeft: '16px' }}>ACCOUNT</div>
                    <SidebarItem label="Profile Settings" tabId="profile" icon="👤" />
                    <SidebarItem label="App Settings" tabId="settings" icon="⚙️" />
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '40px', flex: 1 }}>
                    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                        <h1 style={{ fontSize: '32px', fontWeight: 800 }}>
                            {activeTab === 'upcoming' ? `Welcome, ${username || 'User'} 👋` : 'Dashboard'}
                        </h1>
                        <w3m-button />
                    </header>

                    {activeTab === 'upcoming' && (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                                <div style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #E8E4F5' }}>
                                    <div style={{ fontSize: '13px', color: '#9896B0' }}>Total Tickets 🎫</div>
                                    <div style={{ fontSize: '24px', fontWeight: 800 }}>{(myTickets as any)?.length || 0}</div>
                                </div>
                                <div style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #E8E4F5' }}>
                                    <div style={{ fontSize: '13px', color: '#9896B0' }}>Network ⛓️</div>
                                    <div style={{ fontSize: '20px', fontWeight: 800 }}>Talus Network</div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                                {myTickets && (myTickets as any).length > 0 ? (
                                    (myTickets as any).map((id: any) => <TicketCard key={id.toString()} ticketId={id.toString()} />)
                                ) : (
                                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', background: 'white', borderRadius: '24px', border: '1px dashed #E8E4F5' }}>
                                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>Empty 💨</div>
                                        <p>You don't have any tickets yet.</p>
                                        <Link href="/market" style={{ color: '#7C3AED', fontWeight: 700, textDecoration: 'none' }}>Go to Marketplace →</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tab Profile, Settings, Earnings bisa ditaruh di sini sesuai kode sebelumnya */}
                </div>

                {/* FOOTER DI DASHBOARD */}
                <Footer />
            </main>
        </div>
    )
}