'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { formatEther } from 'viem'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import Navbar from '@/app/components/Navbar'
import Footer from '@/app/components/Footer'

export default function EventDetailPage() {
    const params = useParams()
    const router = useRouter()
    const eventId = params.id as string

    const [qty, setQty] = useState(1)
    const [isWished, setIsWished] = useState(false)

    // 1. Fetch Event Data from Smart Contract
    const { data: event, isLoading } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getEventDetails',
        args: [BigInt(eventId)],
    })

    // 2. Web3 Transaction Hooks
    const { data: hash, writeContract, isPending } = useWriteContract()
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

    // Redirect after successful mint
    useEffect(() => {
        if (isSuccess) {
            setTimeout(() => {
                router.push('/dashboard')
            }, 3000)
        }
    }, [isSuccess, router])

    if (isLoading || !event) {
        return (
            <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#FAFAFF', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                <div style={{ fontWeight: 600, color: '#4B4869', letterSpacing: '1px' }}>Loading Event Data...</div>
            </div>
        )
    }

    const eventData = event as any
    const eventName = eventData.name || eventData[0] || "Unknown Event"
    const eventDate = eventData.date || eventData[1] || "TBA"
    const eventLocation = eventData.location || eventData[2] || "TBA"

    // Handling price logic
    const pricePerTicket = eventData.price != null ? BigInt(eventData.price) : (eventData[3] != null ? BigInt(eventData[3]) : BigInt(0))
    const totalPrice = pricePerTicket * BigInt(qty)

    const handleMint = () => {
        writeContract({
            address: CONTRACT_ADDRESS,
            abi: CONTRACT_ABI,
            functionName: 'mintTicket',
            args: [BigInt(eventId), "General Admission", "ipfs://default-metadata"],
            value: totalPrice
        })
    }

    return (
        <main style={{ background: '#FAFAFF', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            <Navbar />

            {/* CSS Khusus Halaman Detail */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .detail-container { max-width: 1200px; margin: 40px auto; padding: 0 48px; display: grid; grid-template-columns: 1fr 420px; gap: 48px; }
        .ticket-visual { background: linear-gradient(135deg, #1A1A24, #0F0A1E); border-radius: 24px; padding: 60px 40px; color: white; position: relative; overflow: hidden; box-shadow: 0 24px 48px rgba(0,0,0,0.1); }
        .ticket-visual::before { content: ""; position: absolute; left: -25px; top: 50%; transform: translateY(-50%); width: 50px; height: 50px; background: #FAFAFF; border-radius: 50%; box-shadow: inset -5px 0 10px rgba(0,0,0,0.1); }
        .ticket-visual::after { content: ""; position: absolute; right: -25px; top: 50%; transform: translateY(-50%); width: 50px; height: 50px; background: #FAFAFF; border-radius: 50%; box-shadow: inset 5px 0 10px rgba(0,0,0,0.1); }
        .ticket-divider { border-top: 2px dashed rgba(255,255,255,0.2); margin: 40px 0; }
        
        .checkout-card { background: white; border: 1px solid #E8E4F5; border-radius: 24px; padding: 32px; position: sticky; top: 100px; box-shadow: 0 10px 30px rgba(0,0,0,0.03); }
        .qty-control { display: flex; alignItems: center; gap: 16px; border: 1px solid #E8E4F5; padding: 6px; border-radius: 12px; }
        .qty-btn { width: 32px; height: 32px; background: #F3F0FF; color: #7C3AED; border: none; border-radius: 8px; cursor: pointer; font-weight: 700; transition: 0.2s; }
        .qty-btn:hover { background: #7C3AED; color: white; }
        
        .btn-primary { width: 100%; padding: 18px; background: #0F0A1E; color: white; border: none; border-radius: 16px; font-weight: 700; font-size: 15px; cursor: pointer; transition: 0.3s; margin-top: 24px; }
        .btn-primary:hover:not(:disabled) { background: #2A2A35; transform: translateY(-2px); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        
        .btn-outline { width: 100%; padding: 16px; background: transparent; color: #0F0A1E; border: 1px solid #E8E4F5; border-radius: 16px; font-weight: 600; font-size: 14px; cursor: pointer; transition: 0.3s; margin-top: 12px; }
        .btn-outline:hover { background: #F3F0FF; border-color: #7C3AED; color: #7C3AED; }

        @media (max-width: 900px) { .detail-container { grid-template-columns: 1fr; padding: 0 24px; } }
      `}} />

            <div className="detail-container">
                {/* KOLOM KIRI: TIKET VISUAL & INFO */}
                <div>
                    <div className="ticket-visual">
                        <div style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '3px', marginBottom: '24px', color: '#9896B0' }}>
                            OFFICIAL NFT TICKET
                        </div>
                        <h1 style={{ fontSize: '42px', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px' }}>
                            {eventName}
                        </h1>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '32px' }}>
                            <div>
                                <div style={{ fontSize: '12px', color: '#9896B0', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Date</div>
                                <div style={{ fontSize: '16px', fontWeight: 600 }}>{eventDate}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '12px', color: '#9896B0', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Location</div>
                                <div style={{ fontSize: '16px', fontWeight: 600 }}>{eventLocation}</div>
                            </div>
                        </div>

                        <div className="ticket-divider"></div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '11px', color: '#9896B0', marginBottom: '4px', letterSpacing: '1px' }}>ISSUED BY</div>
                                <div style={{ fontWeight: 700, fontSize: '14px' }}>TicketPro Contract</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '11px', color: '#9896B0', marginBottom: '4px', letterSpacing: '1px' }}>NETWORK</div>
                                <div style={{ fontWeight: 700, fontSize: '14px', color: '#10B981' }}>Sepolia ETH</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '48px', padding: '0 10px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px', color: '#0F0A1E' }}>Event Description</h3>
                        <p style={{ color: '#4B4869', lineHeight: 1.8, fontSize: '15px' }}>
                            Secure your spot with blockchain-verified ticketing. This event utilizes NFT technology to guarantee 100% authenticity, preventing scalping and fraud. By minting this ticket, you gain verifiable ownership recorded permanently on the Ethereum network.
                        </p>
                    </div>
                </div>

                {/* KOLOM KANAN: CHECKOUT PANEL */}
                <aside>
                    <div className="checkout-card">
                        <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px', color: '#0F0A1E', borderBottom: '1px solid #E8E4F5', paddingBottom: '16px' }}>
                            Transaction Summary
                        </h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <div>
                                <div style={{ fontWeight: 700, fontSize: '15px', color: '#0F0A1E' }}>General Admission</div>
                                <div style={{ color: '#7C3AED', fontWeight: 700, fontSize: '14px', marginTop: '4px' }}>{formatEther(pricePerTicket)} ETH</div>
                            </div>
                            <div className="qty-control">
                                <button className="qty-btn" onClick={() => qty > 1 && setQty(qty - 1)}>-</button>
                                <span style={{ fontWeight: 700, width: '20px', textAlign: 'center', fontSize: '15px' }}>{qty}</span>
                                <button className="qty-btn" onClick={() => setQty(qty + 1)}>+</button>
                            </div>
                        </div>

                        <div style={{ background: '#FAFAFF', padding: '20px', borderRadius: '16px', border: '1px solid #E8E4F5' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4B4869', marginBottom: '12px' }}>
                                <span>Subtotal</span>
                                <span style={{ fontWeight: 600 }}>{formatEther(totalPrice)} ETH</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#4B4869', marginBottom: '16px' }}>
                                <span>Network Fee</span>
                                <span style={{ fontWeight: 600 }}>Calculated in Wallet</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #D1D5DB', paddingTop: '16px' }}>
                                <span style={{ fontWeight: 700, color: '#0F0A1E' }}>Total Due</span>
                                <span style={{ color: '#7C3AED', fontWeight: 800, fontSize: '20px' }}>{formatEther(totalPrice)} ETH</span>
                            </div>
                        </div>

                        <button
                            onClick={handleMint}
                            disabled={isPending || isConfirming}
                            className="btn-primary"
                        >
                            {isPending ? 'Requesting Signature...' : isConfirming ? 'Confirming on Blockchain...' : 'Mint Ticket'}
                        </button>

                        {isSuccess && (
                            <div style={{ marginTop: '16px', padding: '12px', background: '#ECFDF5', border: '1px solid #10B981', color: '#065F46', borderRadius: '12px', textAlign: 'center', fontSize: '13px', fontWeight: 600 }}>
                                Transaction Successful. Redirecting to your dashboard...
                            </div>
                        )}

                        <button
                            onClick={() => setIsWished(!isWished)}
                            className="btn-outline"
                            style={{ borderColor: isWished ? '#7C3AED' : '#E8E4F5', color: isWished ? '#7C3AED' : '#0F0A1E' }}
                        >
                            {isWished ? 'Saved to Wishlist' : 'Add to Wishlist'}
                        </button>
                    </div>

                    <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'white', borderRadius: '16px', border: '1px solid #E8E4F5' }}>
                        <div style={{ width: '40px', height: '40px', background: '#F3F0FF', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7C3AED', fontWeight: 800 }}>
                            i
                        </div>
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F0A1E' }}>Smart Contract Audited</div>
                            <div style={{ fontSize: '12px', color: '#9896B0', marginTop: '2px' }}>Secured by Ethereum standard protocols.</div>
                        </div>
                    </div>
                </aside>
            </div>

            <Footer />
        </main>
    )
}