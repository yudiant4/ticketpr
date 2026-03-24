'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useBalance } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { QRCodeSVG } from 'qrcode.react'

// ==========================================
// KOMPONEN KARTU TIKET 3D (BISA BERPUTAR)
// ==========================================
const TicketCard = ({ ticketId }: { ticketId: string }) => {
    const [isFlipped, setIsFlipped] = useState(false)

    return (
        <div onClick={() => setIsFlipped(!isFlipped)} style={{ perspective: '1000px', width: '100%', height: '340px', cursor: 'pointer' }}>
            <div style={{ position: 'relative', width: '100%', height: '100%', transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)', transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>

                {/* BAGIAN DEPAN (POSTER NFT) */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: 'linear-gradient(135deg, #7C3AED, #EC4899)', borderRadius: '24px', padding: '30px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 20px 40px rgba(124, 58, 237, 0.25)', border: '1px solid rgba(255,255,255,0.2)' }}>
                    <div>
                        <div style={{ display: 'inline-block', fontSize: '11px', fontWeight: 800, letterSpacing: '2px', background: 'rgba(255,255,255,0.2)', padding: '6px 12px', borderRadius: '50px', backdropFilter: 'blur(10px)', marginBottom: '15px' }}>AUTHENTIC NFT</div>
                        <div style={{ fontSize: '28px', fontWeight: 800, lineHeight: 1.2 }}>VIP Access<br />Ticket #{ticketId}</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '64px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))', transform: 'translateY(-10px)' }}>🎟️</div>
                        <div style={{ fontSize: '14px', fontWeight: 600, opacity: 0.9, marginTop: '10px' }}>Tap to Reveal QR Code 🔄</div>
                    </div>
                </div>

                {/* BAGIAN BELAKANG (QR CODE) */}
                <div style={{ position: 'absolute', width: '100%', height: '100%', backfaceVisibility: 'hidden', background: 'white', border: '2px solid #E8E4F5', borderRadius: '24px', padding: '30px', color: '#0F0A1E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: 'rotateY(180deg)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                    <div style={{ background: 'white', padding: '15px', borderRadius: '20px', border: '2px solid #F3F0FF', boxShadow: '0 10px 30px rgba(124, 58, 237, 0.1)' }}>
                        <QRCodeSVG value={ticketId} size={160} level="H" />
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, marginTop: '24px' }}>Ticket #{ticketId}</div>
                    <div style={{ fontSize: '13px', color: '#9896B0', marginTop: '6px', fontWeight: 600 }}>Show this at the gate</div>
                    <div style={{ fontSize: '12px', color: '#7C3AED', marginTop: '20px', fontWeight: 700 }}>Tap to flip back 🔄</div>
                </div>

            </div>
        </div>
    )
}

// ==========================================
// KOMPONEN TOGGLE (SWITCH ON/OFF)
// ==========================================
const ToggleSwitch = ({ isOn, onToggle }: { isOn: boolean, onToggle: () => void }) => (
    <div onClick={onToggle} style={{ width: '44px', height: '24px', background: isOn ? '#7C3AED' : '#E8E4F5', borderRadius: '50px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}>
        <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: isOn ? '22px' : '2px', transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
    </div>
)

// ==========================================
// HALAMAN DASHBOARD UTAMA
// ==========================================
export default function DashboardLayout() {
    const { address, isConnected } = useAccount()
    const [isMobile, setIsMobile] = useState(false)
    const [activeTab, setActiveTab] = useState('upcoming')
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Profile State
    const [username, setUsername] = useState('')
    const [linkGoogle, setLinkGoogle] = useState(false)
    const [linkTwitter, setLinkTwitter] = useState(false)
    const [linkDiscord, setLinkDiscord] = useState(false)

    // Settings State (Web3 Standards)
    const [notifEmail, setNotifEmail] = useState(true)
    const [hideSpam, setHideSpam] = useState(true)
    const [autoSign, setAutoSign] = useState(false)
    const [testnetMode, setTestnetMode] = useState(true)

    const { data: balanceData } = useBalance({ address })
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#FAFAFF' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>🔐</div>
                <h2 style={{ fontWeight: 800, color: '#0F0A1E', marginBottom: '20px' }}>Please connect your wallet</h2>
                <ConnectButton />
                <Link href="/" style={{ marginTop: '20px', color: '#7C3AED', fontWeight: 600, textDecoration: 'none' }}>← Back to Home</Link>
            </div>
        )
    }

    const SidebarItem = ({ icon, label, tabId, isLink = false, linkUrl = "/" }: any) => {
        const isActive = activeTab === tabId;
        const handleClick = () => { if (!isLink) { setActiveTab(tabId); if (isMobile) setIsMenuOpen(false); } }
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

            {/* SIDEBAR */}
            <aside style={{ width: '260px', background: 'white', borderRight: '1px solid #E8E4F5', display: (isMobile && !isMenuOpen) ? 'none' : 'flex', flexDirection: 'column', position: 'fixed', height: '100vh', top: 0, left: 0, zIndex: 1000 }}>
                <div style={{ padding: '24px', borderBottom: '1px solid #E8E4F5', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🎟️</div>
                        <div style={{ fontWeight: 800, fontSize: '18px' }}>TicketPro</div>
                    </div>
                    {isMobile && <button onClick={() => setIsMenuOpen(false)} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>}
                </div>

                <div style={{ padding: '20px 16px', flex: 1, overflowY: 'auto' }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#9896B0', marginBottom: '12px', paddingLeft: '16px' }}>MY TICKETS</div>
                    <SidebarItem icon="🎫" label="My NFTs" tabId="upcoming" />

                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#9896B0', margin: '24px 0 12px', paddingLeft: '16px' }}>CREATOR</div>
                    <SidebarItem icon="💰" label="My Earnings" tabId="earnings" />

                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#9896B0', margin: '24px 0 12px', paddingLeft: '16px' }}>EXPLORE</div>
                    <SidebarItem icon="🔍" label="Buy Tickets" isLink={true} linkUrl="/market" />
                    <SidebarItem icon="🛡️" label="Verify Scanner" isLink={true} linkUrl="/verify" />

                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#9896B0', margin: '24px 0 12px', paddingLeft: '16px' }}>ACCOUNT</div>
                    <SidebarItem icon="👤" label="Profile" tabId="profile" />
                    <SidebarItem icon="⚙️" label="Settings" tabId="settings" />
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main style={{ flex: 1, marginLeft: isMobile ? '0' : '260px', padding: isMobile ? '20px' : '40px' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        {isMobile && <button onClick={() => setIsMenuOpen(true)} style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '10px', width: '40px', height: '40px', fontSize: '20px', cursor: 'pointer' }}>☰</button>}
                        <div>
                            <h1 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 800 }}>
                                {activeTab === 'earnings' ? 'My Earnings' : activeTab === 'settings' ? 'App Settings' : `Welcome, ${username || 'User'}!`}
                            </h1>
                        </div>
                    </div>
                    <ConnectButton showBalance={!isMobile} />
                </header>

                {/* --- TAB: UPCOMING TICKETS (NFT FLIP CARD) --- */}
                {activeTab === 'upcoming' && (
                    <div>
                        <div style={{ marginBottom: '30px' }}>
                            <h2 style={{ fontSize: '24px', fontWeight: 800 }}>🎟️ My NFT Collection</h2>
                            <p style={{ color: '#9896B0', marginTop: '6px' }}>Tap any ticket to reveal the QR code for entry.</p>
                        </div>
                        {myTickets && (myTickets as any).length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '30px' }}>
                                {(myTickets as any).map((ticket: any, i: number) => <TicketCard key={i} ticketId={ticket.toString()} />)}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '80px 20px', background: 'white', borderRadius: '24px', border: '1px dashed #E8E4F5' }}>
                                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📭</div>
                                <h3 style={{ fontSize: '20px', fontWeight: 800 }}>No tickets found</h3>
                                <Link href="/market" style={{ display: 'inline-block', marginTop: '20px', background: '#7C3AED', color: 'white', padding: '14px 28px', borderRadius: '50px', textDecoration: 'none', fontWeight: 700 }}>Explore Market</Link>
                            </div>
                        )}
                    </div>
                )}

                {/* --- TAB: MY EARNINGS --- */}
                {activeTab === 'earnings' && (
                    <div style={{ maxWidth: '800px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                            {/* Saldo Tersedia */}
                            <div style={{ background: 'linear-gradient(135deg, #10B981, #059669)', borderRadius: '24px', padding: '30px', color: 'white', boxShadow: '0 10px 30px rgba(16, 185, 129, 0.2)' }}>
                                <div style={{ fontSize: '14px', fontWeight: 600, opacity: 0.9, marginBottom: '8px' }}>Available to Withdraw</div>
                                <div style={{ fontSize: '36px', fontWeight: 800 }}>1.45 ETH</div>
                                <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>≈ $4,205.00 USD</div>
                                <button onClick={() => alert('Fitur Withdraw akan memanggil Smart Contract')} style={{ marginTop: '24px', width: '100%', background: 'white', color: '#059669', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>Withdraw Funds</button>
                            </div>
                            {/* Total Pendapatan & Tiket */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #E8E4F5', flex: 1 }}>
                                    <div style={{ fontSize: '13px', color: '#9896B0', fontWeight: 600 }}>Total Revenue (All Time)</div>
                                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F0A1E', marginTop: '4px' }}>3.20 ETH</div>
                                </div>
                                <div style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #E8E4F5', flex: 1 }}>
                                    <div style={{ fontSize: '13px', color: '#9896B0', fontWeight: 600 }}>Total Tickets Sold</div>
                                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F0A1E', marginTop: '4px' }}>128 Tickets</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB: PROFILE --- */}
                {activeTab === 'profile' && (
                    <div style={{ background: 'white', padding: '40px', borderRadius: '24px', border: '1px solid #E8E4F5', maxWidth: '600px' }}>
                        <h2 style={{ fontWeight: 800, marginBottom: '30px' }}>👤 Public Profile</h2>

                        <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Wallet Address</label>
                        <input disabled value={address} style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #E8E4F5', background: '#FAFAFF', color: '#9896B0', marginBottom: '24px' }} />

                        <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Display Name</label>
                        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your name" style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #E8E4F5', outlineColor: '#7C3AED', marginBottom: '40px', fontSize: '16px' }} />

                        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', borderTop: '1px solid #E8E4F5', paddingTop: '30px' }}>🔗 Link Accounts</h3>
                        <p style={{ fontSize: '13px', color: '#9896B0', marginBottom: '20px' }}>Connect social accounts to verify your identity.</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
                            <button onClick={() => setLinkGoogle(!linkGoogle)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', border: '1px solid #E8E4F5', background: 'white', cursor: 'pointer' }}>
                                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>🌐 Google</span>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: linkGoogle ? '#10B981' : '#7C3AED' }}>{linkGoogle ? 'Connected ✅' : 'Connect'}</span>
                            </button>
                            <button onClick={() => setLinkTwitter(!linkTwitter)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', border: '1px solid #E8E4F5', background: 'white', cursor: 'pointer' }}>
                                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px', color: '#1DA1F2' }}>🐦 Twitter / X</span>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: linkTwitter ? '#10B981' : '#7C3AED' }}>{linkTwitter ? 'Connected ✅' : 'Connect'}</span>
                            </button>
                            <button onClick={() => setLinkDiscord(!linkDiscord)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '12px', border: '1px solid #E8E4F5', background: 'white', cursor: 'pointer' }}>
                                <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px', color: '#5865F2' }}>🎮 Discord</span>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: linkDiscord ? '#10B981' : '#7C3AED' }}>{linkDiscord ? 'Connected ✅' : 'Connect'}</span>
                            </button>
                        </div>

                        <button onClick={() => { localStorage.setItem('tp_username', username); alert('✅ Profile saved!'); }} style={{ background: '#0F0A1E', color: 'white', padding: '16px 32px', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer', width: '100%', fontSize: '16px' }}>Save Profile</button>
                    </div>
                )}

                {/* --- TAB: SETTINGS (WEB3 STANDARD) --- */}
                {activeTab === 'settings' && (
                    <div style={{ background: 'white', padding: '40px', borderRadius: '24px', border: '1px solid #E8E4F5', maxWidth: '600px' }}>
                        <h2 style={{ fontWeight: 800, marginBottom: '30px' }}>⚙️ Web3 App Settings</h2>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #E8E4F5' }}>
                            <div><div style={{ fontWeight: 700 }}>Hide Spam NFTs</div><div style={{ fontSize: '13px', color: '#9896B0', marginTop: '4px' }}>Automatically hide unverified or spam tickets.</div></div>
                            <ToggleSwitch isOn={hideSpam} onToggle={() => setHideSpam(!hideSpam)} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #E8E4F5' }}>
                            <div><div style={{ fontWeight: 700 }}>Testnet Mode</div><div style={{ fontSize: '13px', color: '#9896B0', marginTop: '4px' }}>Use Sepolia Testnet instead of Ethereum Mainnet.</div></div>
                            <ToggleSwitch isOn={testnetMode} onToggle={() => setTestnetMode(!testnetMode)} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #E8E4F5' }}>
                            <div><div style={{ fontWeight: 700 }}>Email Notifications</div><div style={{ fontSize: '13px', color: '#9896B0', marginTop: '4px' }}>Receive emails when your tickets are sold.</div></div>
                            <ToggleSwitch isOn={notifEmail} onToggle={() => setNotifEmail(!notifEmail)} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 0' }}>
                            <div><div style={{ fontWeight: 700 }}>Auto-Sign Transactions</div><div style={{ fontSize: '13px', color: '#9896B0', marginTop: '4px' }}>Skip wallet confirmation for small gas fees (Not Recommended).</div></div>
                            <ToggleSwitch isOn={autoSign} onToggle={() => setAutoSign(!autoSign)} />
                        </div>

                    </div>
                )}

            </main>

            {isMobile && isMenuOpen && (
                <div onClick={() => setIsMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999 }} />
            )}
        </div>
    )
}