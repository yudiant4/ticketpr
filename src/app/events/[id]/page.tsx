'use client'

export const dynamic = 'force-dynamic';

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { useEvent, useMintTicket } from '@/hooks/useTicketPro'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function EventDetailPage() {
    const params = useParams()
    const { isConnected } = useAccount()
    const [mounted, setMounted] = useState(false)

    // 1. Ambil ID dari URL dan ubah ke BigInt (Penting!)
    const eventId = params?.id ? BigInt(params.id as string) : BigInt(0)

    // 2. Ambil data event dari blockchain
    const { data: event, isLoading } = useEvent(eventId)

    // 3. Panggil Hook Mint
    const { mint, isPending, isConfirming, isSuccess } = useMintTicket()

    useEffect(() => {
        setMounted(true)
    }, [])

    const handleMint = async () => {
        if (!event) return;

        try {
            // PERBAIKAN: Kirim semua data yang dibutuhkan oleh Hook useMintTicket kamu
            await mint(
                eventId,
                "General",       // Tier
                event.name,      // Event Name
                event.date,      // Date
                event.location,  // Venue
                "",              // City (kosongkan jika sudah ada di location)
                event.price      // Price (akan di-parseEther di dalam Hook)
            );
        } catch (err) {
            console.error("Mint Error:", err);
            alert("Minting failed! Check console.");
        }
    }

    if (!mounted) return null;

    return (
        <main style={{ background: '#FAFAFF', minHeight: '100vh', paddingBottom: '100px' }}>
            <Navbar />

            <div style={{ maxWidth: '1000px', margin: '100px auto 0', padding: '0 20px' }}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>Loading Event Data... ⏳</div>
                ) : !event ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>Event Not Found! ❌</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>

                        {/* KIRI: Gambar Poster */}
                        <div>
                            <img
                                src={event.ipfsHash.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}
                                alt="Event"
                                style={{ width: '100%', borderRadius: '32px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                            />
                        </div>

                        {/* KANAN: Info & Tombol Mint */}
                        <div style={{ background: 'white', padding: '40px', borderRadius: '32px', border: '1px solid #E8E4F5' }}>
                            <span style={{ background: '#F3F0FF', color: '#7C3AED', padding: '6px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 700 }}>
                                NFT TICKET #{eventId.toString()}
                            </span>

                            <h1 style={{ fontSize: '36px', fontWeight: 800, margin: '16px 0' }}>{event.name}</h1>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <span style={{ fontSize: '20px' }}>📅</span>
                                    <div>
                                        <div style={{ fontWeight: 700 }}>Date & Time</div>
                                        <div style={{ color: '#9896B0' }}>{event.date}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <span style={{ fontSize: '20px' }}>📍</span>
                                    <div>
                                        <div style={{ fontWeight: 700 }}>Location</div>
                                        <div style={{ color: '#9896B0' }}>{event.location}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ padding: '24px', background: '#FAFAFF', borderRadius: '20px', marginBottom: '32px' }}>
                                <div style={{ fontSize: '14px', color: '#9896B0' }}>Current Price</div>
                                <div style={{ fontSize: '32px', fontWeight: 800, color: '#0F0A1E' }}>{event.price} ETH</div>
                            </div>

                            {!isConnected ? (
                                <div style={{ color: '#EF4444', textAlign: 'center', fontWeight: 600 }}>Please connect wallet first 🔑</div>
                            ) : (
                                <button
                                    onClick={handleMint}
                                    disabled={isPending || isConfirming}
                                    style={{
                                        width: '100%', padding: '18px', background: isSuccess ? '#16A34A' : '#7C3AED',
                                        color: 'white', border: 'none', borderRadius: '16px', fontWeight: 800,
                                        cursor: (isPending || isConfirming) ? 'not-allowed' : 'pointer', fontSize: '16px'
                                    }}
                                >
                                    {isPending ? 'Uploading Metadata... ☁️' : isConfirming ? 'Confirming on Chain... ⛓️' : isSuccess ? 'Minted Successfully! 🎉' : 'Mint My Ticket Now 🚀'}
                                </button>
                            )}
                        </div>

                    </div>
                )}
            </div>
            <Footer />
        </main>
    )
}