'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { formatEther } from 'viem'
import { sepolia } from 'wagmi/chains'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import Navbar from '../components/Navbar' // Tanda kutip sudah saya perbaiki di sini
import Footer from './components/Footer'

// --- HELPER: Ubah IPFS ke URL Browser ---
const getIPFSUrl = (ipfsUri: string) => {
    if (!ipfsUri) return "";
    if (ipfsUri.startsWith("ipfs://")) {
        return `https://gateway.pinata.cloud/ipfs/${ipfsUri.split("ipfs://")[1]}`;
    }
    return ipfsUri;
};

// --- KOMPONEN KOTAK EVENT ---
function EventItem({ id, onBuy, isMobile }: { id: bigint, onBuy: (event: any) => void, isMobile: boolean }) {
    const { data: event, isLoading } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getEventDetails', 
        args: [id],
    })

    if (isLoading || !event) return null;

    const obj = event as any;
    const name = obj.name || obj[0] || "Unnamed Event";
    const date = obj.date || obj[1] || "TBA";
    const location = obj.location || obj[2] || "Remote";
    const price = obj.price != null ? BigInt(obj.price) : obj[3] != null ? BigInt(obj[3]) : BigInt(0);
    const imageUri = obj.uri || obj.metadataURI || obj[6] || "";

    return (
        <div style={{ 
            background: 'white', border: '1px solid #E8E4F5', borderRadius: '20px', 
            overflow: 'hidden', display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row', // HP: Tumpuk ke bawah
            transition: 'transform 0.2s'
        }}>
            {/* Poster Event */}
            <div style={{ 
                width: isMobile ? '100%' : '180px', 
                height: isMobile ? '220px' : 'auto',
                background: '#F3F0FF', flexShrink: 0, position: 'relative'
            }}>
                {imageUri ? (
                    <img 
                        src={getIPFSUrl(imageUri)} 
                        alt={name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { (e.target as any).src = "https://via.placeholder.com/180x240?text=No+Image" }}
                    />
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '40px' }}>🎫</div>
                )}
            </div>

            {/* Detail Event */}
            <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>{name}</h3>
                        <span style={{ background: '#F3F0FF', color: '#7C3AED', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '50px' }}>#{id.toString()}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#7C3AED', fontWeight: 600, margin: '4px 0' }}>📍 {location}</p>
                    <p style={{ fontSize: '13px', color: '#9896B0', margin: 0 }}>📅 {date}</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', borderTop: '1px solid #F0EEF9', paddingTop: '15px' }}>
                    <div>
                        <p style={{ fontSize: '11px', color: '#9896B0', margin: 0 }}>Price</p>
                        <p style={{ fontSize: '18px', fontWeight: 800, color: '#0F0A1E', margin: 0 }}>{formatEther(price)} ETH</p>
                    </div>
                    <button
                        onClick={() => onBuy({ id, name, price })}
                        style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: 'white', border: 'none', borderRadius: '50px', padding: '10px 22px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                        Get Ticket
                    </button>
                </div>
            </div>
        </div>
    )
}

// --- HALAMAN MARKET UTAMA ---
export default function MarketPage() {
    const [isMobile, setIsMobile] = useState(false)
    const [buyModal, setBuyModal] = useState<any | null>(null)

    // Deteksi Ukuran Layar HP
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
        <main style={{ background: '#FAFAFF', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            <Navbar />

            {/* HEADER */}
            <div style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)', padding: isMobile ? '40px 16px' : '60px 48px', color: 'white' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <h1 style={{ fontSize: isMobile ? '32px' : '40px', fontWeight: 800, margin: 0 }}>🛒 Event Market</h1>
                    <p style={{ opacity: 0.8, fontSize: '16px', marginTop: '8px' }}>Mint official NFT tickets for upcoming events</p>
                </div>
            </div>

            {/* GRID EVENT: 2 Kolom di Laptop, 1 Kolom di HP */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: isMobile ? '24px 16px' : '40px 48px' }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', // INI KUNCINYA
                    gap: isMobile ? '16px' : '24px' 
                }}>
                    {eventCount && Number(eventCount) > 0 ? (
                        Array.from({ length: Number(eventCount) }).map((_, i) => (
                            <EventItem 
                                key={i} 
                                id={BigInt(i + 1)} 
                                isMobile={isMobile} 
                                onBuy={(ev) => setBuyModal(ev)} 
                            />
                        ))
                    ) : (
                        <p style={{ color: '#9896B0', textAlign: 'center', gridColumn: '1/-1' }}>No events found on blockchain.</p>
                    )}
                </div>
            </div>

            {/* MODAL BELI (Versi HP ramah jempol) */}
            {buyModal && (
                <div onClick={() => setBuyModal(null)} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(15,10,30,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: isMobile ? 'flex-end' : 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: isMobile ? '24px 24px 0 0' : '24px', padding: '32px', width: isMobile ? '100%' : '400px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 800, textAlign: 'center', margin: 0 }}>Confirm Purchase</h3>
                        <p style={{ textAlign: 'center', color: '#9896B0', margin: '12px 0 24px' }}>You are minting <b>{buyModal.name}</b></p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setBuyModal(null)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #E8E4F5', background: 'none', fontWeight: 700 }}>Cancel</button>
                            <button 
                                onClick={() => writeContract({
                                    address: CONTRACT_ADDRESS,
                                    abi: CONTRACT_ABI,
                                    functionName: 'mintTicket',
                                    args: [buyModal.id, 'General', 'ipfs://default'],
                                    value: buyModal.price
                                })} 
                                style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', background: '#7C3AED', color: 'white', fontWeight: 700 }}>
                                {isBuying ? 'Confirming...' : 'Pay Now'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}