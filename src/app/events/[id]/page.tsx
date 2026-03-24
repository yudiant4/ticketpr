'use client'

export const dynamic = 'force-dynamic';

import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { formatEther } from 'viem'
import { useEvent, useMintTicket } from '@/hooks/useTicketPro'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function EventDetailPage() {
    const params = useParams()
    const { isConnected } = useAccount()
    const [mounted, setMounted] = useState(false)

    // 1. Ambil ID dari URL dan ubah ke BigInt
    const eventId = params?.id ? BigInt(params.id as string) : BigInt(0)
    const { data: event, isLoading } = useEvent(eventId)
    
    // 2. Ambil fungsi mintTicket dari hook
    const { mintTicket, isPending, isConfirming, isSuccess, error } = useMintTicket()

    useEffect(() => { setMounted(true) }, [])

    const handleMint = async () => {
        if (!event) return;
        try {
            // Kita kirim harganya langsung ke hook
            await mintTicket(eventId, (event as any).price);
        } catch (err) {
            console.error("Mint Error:", err);
        }
    }

    if (!mounted) return null;

    return (
        <main style={{ background: '#FAFAFF', minHeight: '100vh', paddingBottom: '100px' }}>
            <Navbar />
            <div style={{ maxWidth: '1000px', margin: '100px auto 0', padding: '0 20px' }}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>Loading... ⏳</div>
                ) : !event ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>Event Not Found! ❌</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px' }}>
                        <img src={(event as any).ipfsHash?.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')} style={{ width: '100%', borderRadius: '32px' }} />

                        <div style={{ background: 'white', padding: '40px', borderRadius: '32px', border: '1px solid #E8E4F5' }}>
                            <h1 style={{ fontSize: '36px', fontWeight: 800 }}>{(event as any).name}</h1>
                            <div style={{ padding: '24px', background: '#FAFAFF', borderRadius: '20px', margin: '24px 0' }}>
                                <div style={{ fontSize: '14px', color: '#9896B0' }}>Ticket Price</div>
                                <div style={{ fontSize: '32px', fontWeight: 800 }}>
                                    {typeof (event as any).price === 'bigint' ? formatEther((event as any).price) : (event as any).price} ETH
                                </div>
                            </div>

                            {!isConnected ? (
                                <div style={{ color: '#EF4444', textAlign: 'center' }}>Connect Wallet First! 🔑</div>
                            ) : (
                                <button
                                    onClick={handleMint}
                                    disabled={isPending || isConfirming}
                                    style={{ width: '100%', padding: '18px', background: isSuccess ? '#16A34A' : '#7C3AED', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 800, cursor: 'pointer' }}
                                >
                                    {isPending || isConfirming ? 'Check MetaMask... 🦊' : isSuccess ? 'Success! 🎉' : 'Mint Ticket Now 🚀'}
                                </button>
                            )}
                            {error && <p style={{ color: 'red', fontSize: '11px', marginTop: '10px' }}><b>Gagal:</b> {error.message.slice(0, 80)}...</p>}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    )
}