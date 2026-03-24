'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { formatEther, parseEther } from 'viem'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export default function EventDetailPage() {
    const params = useParams()
    const eventId = params.id as string

    const [qty, setQty] = useState(1)
    const [isWished, setIsWished] = useState(false)

    // 1. AMBIL DATA EVENT DARI BLOCKCHAIN
    const { data: event, isLoading } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getEventDetails',
        args: [BigInt(eventId)],
    })

    // 2. LOGIKA TRANSAKSI (MINTING)
    const { data: hash, writeContract, isPending } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

    if (isLoading || !event) return <div style={{ textAlign: 'center', padding: '100px' }}>Loading Event Data...</div>

    const eventData = event as any
    const pricePerTicket = eventData.price || eventData[3]
    const totalPrice = BigInt(pricePerTicket) * BigInt(qty)

    const handleMint = () => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'mintTicket',
            args: [BigInt(eventId), "General Admission", "ipfs://metadata-link"],
            value: totalPrice
        })
    }

    return (
        <main style={{ background: '#FAFAFF', minHeight: '100vh' }}>
            <Navbar />
            <style dangerouslySetInnerHTML={{
                __html: `
        .detail-container { max-width: 1200px; margin: 40px auto; padding: 0 20px; display: grid; grid-template-columns: 1fr 400px; gap: 40px; }
        .ticket-visual { background: linear-gradient(135deg, #7C3AED, #EC4899); border-radius: 30px; padding: 60px; color: white; position: relative; overflow: hidden; }
        .ticket-visual::before { content: ""; position: absolute; left: -25px; top: 50%; transform: translateY(-50%); width: 50px; height: 50px; background: #FAFAFF; border-radius: 50%; }
        .ticket-visual::after { content: ""; position: absolute; right: -25px; top: 50%; transform: translateY(-50%); width: 50px; height: 50px; background: #FAFAFF; border-radius: 50%; }
        .checkout-card { background: white; border: 1px solid #E8E4F5; border-radius: 24px; padding: 32px; position: sticky; top: 100px; }
        .qty-btn { width: 40px; height: 40px; border: 1px solid #E8E4F5; background: white; border-radius: 10px; cursor: pointer; font-weight: 800; }
        @media (max-width: 900px) { .detail-container { grid-template-columns: 1fr; } }
      `}} />

            <div className="detail-container">
                {/* SISI KIRI: INFO EVENT (Desain dari ticketpro-detail.html) */}
                <div>
                    <div className="ticket-visual">
                        <div style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '2px', marginBottom: '20px', opacity: 0.8 }}>OFFICIAL NFT TICKET</div>
                        <h1 style={{ fontSize: '48px', fontWeight: 800 }}>{eventData.name || eventData[0]}</h1>
                        <p style={{ marginTop: '20px', fontSize: '18px' }}>📍 {eventData.location || eventData[2]}</p>
                        <p style={{ fontSize: '18px' }}>📅 {eventData.date || eventData[1]}</p>
                        <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '2px dashed rgba(255,255,255,0.3)', display: 'flex', justifyContent: 'space-between' }}>
                            <div><small>ORGANIZER</small><div style={{ fontWeight: 700 }}>Verified Partner</div></div>
                            <div><small>NETWORK</small><div style={{ fontWeight: 700 }}>Sepolia Testnet</div></div>
                        </div>
                    </div>

                    <div style={{ marginTop: '40px' }}>
                        <h3 style={{ fontWeight: 800, marginBottom: '15px' }}>About Event</h3>
                        <p style={{ color: '#4B4869', lineHeight: 1.8 }}>Experience the future of festivals with blockchain-secured tickets. This event uses NFT technology to ensure 100% authenticity and zero fraud.</p>
                    </div>
                </div>

                {/* SISI KANAN: CHECKOUT BOX */}
                <aside className="checkout-card">
                    <h3 style={{ fontWeight: 800, marginBottom: '24px' }}>Select Tickets</h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <div>
                            <div style={{ fontWeight: 700 }}>General Admission</div>
                            <div style={{ color: '#7C3AED', fontWeight: 800 }}>{formatEther(pricePerTicket)} ETH</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <button className="qty-btn" onClick={() => qty > 1 && setQty(qty - 1)}>-</button>
                            <span style={{ fontWeight: 800 }}>{qty}</span>
                            <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
                        </div>
                    </div>

                    <div style={{ background: '#F3F0FF', padding: '20px', borderRadius: '16px', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '10px' }}>
                            <span>Subtotal ({qty}x)</span>
                            <span>{formatEther(totalPrice)} ETH</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '18px', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '10px' }}>
                            <span>Total Price</span>
                            <span style={{ color: '#7C3AED' }}>{formatEther(totalPrice)} ETH</span>
                        </div>
                    </div>

                    <button
                        onClick={handleMint}
                        disabled={isPending || isConfirming}
                        style={{
                            width: '100%', padding: '18px', background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                            color: 'white', border: 'none', borderRadius: '50px', fontWeight: 800, cursor: 'pointer',
                            boxShadow: '0 10px 25px rgba(124, 58, 237, 0.3)'
                        }}
                    >
                        {isPending ? 'Confirming Wallet...' : isConfirming ? 'Minting on Chain...' : '🎟️ Mint NFT Ticket'}
                    </button>

                    {isSuccess && (
                        <div style={{ marginTop: '20px', color: '#16A34A', textAlign: 'center', fontWeight: 700 }}>
                            ✅ Minting Success! Go to Dashboard.
                        </div>
                    )}

                    <button
                        onClick={() => setIsWished(!isWished)}
                        style={{ width: '100%', marginTop: '12px', background: 'none', border: '1px solid #E8E4F5', padding: '12px', borderRadius: '50px', cursor: 'pointer', fontWeight: 600 }}
                    >
                        {isWished ? '❤️ Saved to Wishlist' : '🤍 Add to Wishlist'}
                    </button>
                </aside>
            </div>
            <Footer />
        </main>
    )
}