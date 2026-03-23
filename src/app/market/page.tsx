'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { formatEther } from 'viem'
import { sepolia } from 'wagmi/chains'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import Navbar from '@/components/Navbar'

// Komponen Event: Adaptasi Tampilan HP vs Laptop
function EventItem({ id, onBuy, isMobile }: { id: bigint, onBuy: (event: any) => void, isMobile: boolean }) {
    const { data: event, isLoading } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getEventDetails', 
        args: [id],
    })

    if (isLoading || !event) return null;

    // Proteksi data (sama seperti sebelumnya)
    const obj = event as any;
    const name = obj.name || obj[0] || "Unnamed Event";
    const date = obj.date || obj[1] || "TBA";
    const location = obj.location || obj[2] || "Remote";
    const price = obj.price != null ? BigInt(obj.price) : obj[3] != null ? BigInt(obj[3]) : BigInt(0);

    return (
        <div style={{ 
            background: 'white', 
            border: '1px solid #E8E4F5', 
            borderRadius: '20px', 
            overflow: 'hidden', 
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row' // DI HP: Gambar di atas, Tulisan di bawah
        }}>
            <div style={{ 
                width: isMobile ? '100%' : '120px', 
                height: isMobile ? '160px' : 'auto',
                background: 'linear-gradient(135deg,#7C3AED,#EC4899)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: isMobile ? '64px' : '48px', 
                flexShrink: 0 
            }}>
                🎫
            </div>
            <div style={{ padding: '20px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F0A1E' }}>{name}</div>
                        <div style={{ fontSize: '13px', color: '#7C3AED', fontWeight: 600 }}>{location}</div>
                    </div>
                    <span style={{ background: '#F3F0FF', color: '#7C3AED', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '50px' }}>#{id.toString()}</span>
                </div>
                <div style={{ fontSize: '13px', color: '#9896B0', marginBottom: '16px' }}>📅 {date}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F0EEF9', paddingTop: '12px' }}>
                    <div>
                        <div style={{ fontSize: '11px', color: '#9896B0' }}>Price</div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F0A1E' }}>{formatEther(price)} ETH</div>
                    </div>
                    <button
                        onClick={() => onBuy({ id, name, price })}
                        style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: 'white', border: 'none', borderRadius: '50px', padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                        Mint Ticket
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function MarketPage() {
    const { isConnected } = useAccount()
    const [buyModal, setBuyModal] = useState<any | null>(null)
    const [isMobile, setIsMobile] = useState(false)

    // Logic Deteksi HP
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const { data: eventCount } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'eventCount',
    })

    const { writeContract, isPending: isBuying } = useWriteContract()

    return (
        <main style={{ background: '#FAFAFF', minHeight: '100vh', color: '#0F0A1E', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            <Navbar />

            {/* HEADER: Ukuran padding menyesuaikan HP */}
            <div style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7,#EC4899)', padding: isMobile ? '40px 20px' : '60px 48px' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>🛒 Event Market</h1>
                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)' }}>Get your official NFT tickets on the blockchain</p>
                </div>
            </div>

            {/* GRID: 2 Kolom di Laptop, 1 Kolom di HP */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '24px 16px' : '40px 48px' }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(2,1fr)', 
                    gap: isMobile ? '16px' : '24px' 
                }}>
                    {eventCount && Number(eventCount) > 0 ? (
                        Array.from({ length: Number(eventCount) }).map((_, i) => (
                            <EventItem key={i} id={BigInt(i + 1)} isMobile={isMobile} onBuy={(ev) => setBuyModal(ev)} />
                        ))
                    ) : (
                        <p style={{ color: '#9896B0' }}>No active events found.</p>
                    )}
                </div>
            </div>

            {/* MODAL: Di HP lebarnya penuh agar tidak kekecilan */}
            {buyModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(15,10,30,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center' }}>
                    <div style={{ 
                        background: 'white', 
                        borderRadius: isMobile ? '24px 24px 0 0' : '24px', 
                        padding: '32px', 
                        width: isMobile ? '100%' : '400px' 
                    }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 800, textAlign: 'center' }}>Confirm Purchase</h3>
                        <p style={{ textAlign: 'center', color: '#9896B0', margin: '12px 0 24px' }}>You are minting a ticket for <b>{buyModal.name}</b></p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setBuyModal(null)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #E8E4F5', background: 'none', fontWeight: 700 }}>Cancel</button>
                            <button 
                                onClick={() => {
                                    writeContract({
                                        address: CONTRACT_ADDRESS,
                                        abi: CONTRACT_ABI,
                                        functionName: 'mintTicket',
                                        args: [buyModal.id, 'General', 'ipfs://default'],
                                        value: buyModal.price
                                    })
                                    setBuyModal(null)
                                }}
                                style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', background: '#7C3AED', color: 'white', fontWeight: 700 }}>
                                {isBuying ? 'Processing...' : 'Pay Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}