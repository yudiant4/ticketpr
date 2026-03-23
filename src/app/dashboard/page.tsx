'use client'

import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import Navbar from '../components/Navbar'

// --- HELPER GAMBAR IPFS ---
const getIPFSUrl = (ipfsUri: string) => {
    if (!ipfsUri) return "";
    if (ipfsUri.startsWith("ipfs://")) {
        return `https://gateway.pinata.cloud/ipfs/${ipfsUri.split("ipfs://")[1]}`;
    }
    return ipfsUri;
};

export default function DashboardPage() {
    const { address, isConnected } = useAccount()
    const [isMobile, setIsMobile] = useState(false)

    // --- DETEKSI LAYAR HP ---
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Ambil data tiket milik user (sesuai fungsi di kontrak kamu)
    const { data: myTickets, isLoading } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getOwnedTickets', // Sesuaikan dengan nama fungsi di kontrakmu
        args: [address],
    })

    if (!isConnected) {
        return (
            <main style={{ background: '#FAFAFF', minHeight: '100vh' }}>
                <Navbar />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '64px' }}>🎟️</div>
                    <h2 style={{ fontWeight: 800, marginTop: '20px' }}>Connect wallet to see your tickets</h2>
                </div>
            </main>
        )
    }

    return (
        <main style={{ background: '#FAFAFF', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            <Navbar />

            {/* HEADER DASHBOARD */}
            <div style={{ 
                background: 'linear-gradient(135deg, #0F0A1E, #2D1B69)', 
                padding: isMobile ? '40px 20px' : '60px 48px',
                color: 'white'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: 800, margin: 0 }}>My Collection</h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>You own {myTickets ? (myTickets as any).length : 0} NFT tickets</p>
                </div>
            </div>

            {/* GRID TIKET: 3 Kolom di Laptop, 1 Kolom di HP */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '24px 16px' : '40px 48px' }}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#9896B0' }}>⏳ Loading your tickets...</div>
                ) : (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', 
                        gap: isMobile ? '16px' : '24px' 
                    }}>
                        {myTickets && (myTickets as any).length > 0 ? (
                            (myTickets as any).map((ticket: any, i: number) => (
                                <div key={i} style={{ 
                                    background: 'white', 
                                    borderRadius: '24px', 
                                    border: '1px solid #E8E4F5', 
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                                    transition: 'transform 0.2s'
                                }}>
                                    {/* Gambar Tiket */}
                                    <div style={{ height: '200px', background: '#F3F0FF', position: 'relative' }}>
                                        <img 
                                            src={getIPFSUrl(ticket.uri || ticket[6])} 
                                            alt="Ticket" 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => {(e.target as any).src = "https://via.placeholder.com/400x200?text=NFT+Ticket"}}
                                        />
                                        <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(255,255,255,0.9)', padding: '4px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: 800, color: '#7C3AED' }}>
                                            #{ticket.tokenId?.toString() || i+1}
                                        </div>
                                    </div>

                                    {/* Info Tiket */}
                                    <div style={{ padding: '20px' }}>
                                        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px 0' }}>{ticket.eventName || ticket[0]}</h3>
                                        <p style={{ fontSize: '13px', color: '#7C3AED', fontWeight: 600, margin: '0 0 16px 0' }}>{ticket.location || ticket[2]}</p>
                                        
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F0EEF9', paddingTop: '15px' }}>
                                            <button style={{ 
                                                width: '100%', 
                                                padding: '12px', 
                                                borderRadius: '12px', 
                                                border: '1.5px solid #E8E4F5', 
                                                background: 'white', 
                                                fontWeight: 700, 
                                                cursor: 'pointer',
                                                fontSize: '13px'
                                            }}>
                                                View Ticket Detail
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px 0' }}>
                                <p style={{ color: '#9896B0' }}>You don't have any tickets yet.</p>
                                <Link href="/market" style={{ color: '#7C3AED', fontWeight: 700, textDecoration: 'none' }}>Go buy some! →</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    )
}