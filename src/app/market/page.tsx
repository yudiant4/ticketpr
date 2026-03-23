'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { sepolia } from 'wagmi/chains'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'

// Komponen Kecil untuk menampilkan masing-masing Event dari Blockchain
function EventItem({ id, onBuy }: { id: bigint, onBuy: (event: any) => void }) {
    // 1. MENGGUNAKAN getEventDetails untuk ambil data asli
    const { data: event } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getEventDetails',
        args: [id],
    })

    if (!event) return null;

    // Mapping data dari contract (asumsi urutan: name, date, location, price, supply, royalty, uri)
    const [name, date, location, price, maxSupply, royalty, uri] = event as any;

    return (
        <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '20px', overflow: 'hidden', display: 'flex' }}>
            <div style={{ width: '120px', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', flexShrink: 0 }}>
                🎫
            </div>
            <div style={{ padding: '20px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F0A1E', marginBottom: '3px' }}>{name}</div>
                        <div style={{ fontSize: '12px', color: '#7C3AED', fontWeight: 600 }}>{location}</div>
                    </div>
                    <span style={{ background: '#F3F0FF', color: '#7C3AED', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '50px' }}>ID: {id.toString()}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#9896B0', marginBottom: '14px' }}>Date: {date}</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: '11px', color: '#9896B0' }}>Price</div>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#7C3AED' }}>{formatEther(price)} ETH</div>
                    </div>
                    <button
                        onClick={() => onBuy({ id, name, price, location })}
                        style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: 'white', border: 'none', borderRadius: '50px', padding: '10px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Buy Ticket
                    </button>
                </div>
            </div>
        </div>
    )
}

// Hook: Buy ticket (Disesuaikan agar dinamis)
function useBuyTicket() {
    const { writeContract, data: hash, isPending } = useWriteContract()
    const { isSuccess } = useWaitForTransactionReceipt({ hash })

    const buyTicket = (eventId: bigint, price: bigint) => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'mintTicket',
            args: [eventId, 'General', 'ipfs://default'], // Argumen disesuaikan dengan event yang dipilih
            value: price,
            chainId: sepolia.id,
        })
    }

    return { buyTicket, hash, isPending, isSuccess }
}

export default function MarketPage() {
    const { address, isConnected } = useAccount()
    const [buyModal, setBuyModal] = useState<any | null>(null)
    const [toast, setToast] = useState('')

    // 2. AMBIL TOTAL EVENT DARI CONTRACT
    const { data: eventCount } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'eventCount',
    })

    const { buyTicket, isPending: isBuying, isSuccess: isBought } = useBuyTicket()

    const showToast = (msg: string) => {
        setToast(msg)
        setTimeout(() => setToast(''), 3000)
    }

    return (
        <main style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', background: '#FAFAFF', minHeight: '100vh', color: '#0F0A1E' }}>
            {/* NAVBAR (Tetap sama) */}
            <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '0 48px', height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #E8E4F5' }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '20px', color: '#0F0A1E', textDecoration: 'none' }}>
                    <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🎟️</div>
                    Ticket<span style={{ color: '#7C3AED' }}>Pro</span>
                </Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
                    <Link href="/create-event" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Create Event</Link>
                    <Link href="/market" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Market</Link>
                    <Link href="/verify" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Verify</Link>
                </div>
                <ConnectButton />
            </nav>

            {/* HEADER */}
            <div style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7,#EC4899)', padding: '48px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <h1 style={{ fontSize: '40px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>🎫 Browse Events</h1>
                    <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)' }}>Discover and mint official NFT tickets directly from creators</p>
                </div>
            </div>

            {/* LISTINGS (DATA ASLI DARI BLOCKCHAIN) */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 48px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '24px' }}>Active Events</h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '20px' }}>
                    {/* 3. LOOPING BERDASARKAN JUMLAH EVENT DI CONTRACT */}
                    {eventCount && Number(eventCount) > 0 ? (
                        Array.from({ length: Number(eventCount) }).map((_, i) => (
                            <EventItem
                                key={i}
                                id={BigInt(i + 1)}
                                onBuy={(ev) => isConnected ? setBuyModal(ev) : showToast('🔗 Connect wallet first!')}
                            />
                        ))
                    ) : (
                        <p style={{ color: '#9896B0' }}>No events found on the blockchain.</p>
                    )}
                </div>
            </div>

            {/* BUY MODAL (Disesuaikan data blockchain) */}
            {buyModal && (
                <div onClick={() => setBuyModal(null)} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(15,10,30,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: 'white', borderRadius: '24px', padding: '40px', width: '420px', boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px', textAlign: 'center' }}>🎫</div>
                        <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F0A1E', marginBottom: '4px', textAlign: 'center' }}>{buyModal.name}</div>

                        <div style={{ background: '#FAFAFF', borderRadius: '14px', padding: '16px', margin: '20px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                                <span style={{ fontSize: '13px', color: '#9896B0' }}>Price</span>
                                <span style={{ fontSize: '13px', fontWeight: 700, color: '#7C3AED' }}>{formatEther(buyModal.price)} ETH</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setBuyModal(null)} style={{ flex: 1, padding: '13px', background: 'white', border: '1px solid #E8E4F5', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                            <button
                                onClick={() => buyTicket(buyModal.id, buyModal.price)}
                                disabled={isBuying}
                                style={{ flex: 2, padding: '13px', background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                                {isBuying ? '⏳ Confirming...' : 'Confirm Purchase'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TOAST (Tetap sama) */}
            {toast && (
                <div style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 999, background: '#0F0A1E', color: 'white', padding: '14px 20px', borderRadius: '14px', fontSize: '13px', fontWeight: 600 }}>
                    {toast}
                </div>
            )}
        </main>
    )
}