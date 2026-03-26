'use client'

export const dynamic = 'force-dynamic';

import { Suspense, useState } from 'react' // Tambahkan Suspense
import { useSearchParams } from 'next/navigation'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import Navbar from '../components/Navbar'

// 1. Pindahkan logika verifikasi ke komponen kecil
function VerifyContent() {
    const searchParams = useSearchParams()
    const tokenId = searchParams.get('tokenId')
    const [inputToken, setInputToken] = useState('')

    const { data: ticket, isLoading } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getTicket',
        args: tokenId ? [BigInt(tokenId)] : undefined,
    })

    const { data: event } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getEventDetails',
        args: ticket ? [(ticket as any).eventId] : undefined,
    })

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ fontWeight: 800, fontSize: '32px', marginBottom: '10px' }}>Ticket Verification 🛡️</h1>
            <p style={{ color: '#9896B0', marginBottom: '40px' }}>Verify the authenticity of TicketPro NFTs</p>

            {!tokenId ? (
                <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #E8E4F5' }}>
                    <label style={{ display: 'block', fontWeight: 700, marginBottom: '12px', textAlign: 'left' }}>Enter Ticket ID</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="number"
                            value={inputToken}
                            onChange={(e) => setInputToken(e.target.value)}
                            placeholder="e.g. 1"
                            style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1.5px solid #F3F0FF' }}
                        />
                        <button
                            onClick={() => window.location.href = `/verify?tokenId=${inputToken}`}
                            style={{ padding: '14px 24px', background: '#7C3AED', color: 'white', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                        >
                            Verify
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ background: 'white', padding: '40px', borderRadius: '32px', border: '2px solid #E8E4F5' }}>
                    {isLoading ? (
                        <p>Verifying on blockchain... ⏳</p>
                    ) : ticket && (ticket as any).originalOwner !== "0x0000000000000000000000000000000000000000" ? (
                        <div>
                            <div style={{ width: '80px', height: '80px', background: '#DCFCE7', color: '#16A34A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 24px' }}>✓</div>
                            <h2 style={{ fontWeight: 800, fontSize: '24px', color: '#16A34A' }}>Authentic Ticket</h2>
                            <div style={{ marginTop: '32px', padding: '24px', background: '#FAFAFF', borderRadius: '20px', textAlign: 'left' }}>
                                <div style={{ marginBottom: '12px' }}>🎫 <b>Ticket ID:</b> #{tokenId}</div>
                                <div style={{ marginBottom: '12px' }}>🏁 <b>Event:</b> {(event as any)?.name || 'Loading...'}</div>
                                <div style={{
                                    marginTop: '15px',
                                    padding: '8px',
                                    background: (ticket as any).used ? '#FEE2E2' : '#DCFCE7',
                                    color: (ticket as any).used ? '#DC2626' : '#16A34A',
                                    borderRadius: '8px', textAlign: 'center', fontWeight: 800
                                }}>
                                    {(ticket as any).used ? 'ALREADY USED ❌' : 'VALID FOR ENTRY ✅'}
                                </div>
                            </div>
                            <button onClick={() => window.location.href = '/verify'} style={{ marginTop: '30px', background: 'none', border: 'none', color: '#9896B0', cursor: 'pointer' }}>← Back</button>
                        </div>
                    ) : (
                        <p>Invalid Ticket ❌</p>
                    )}
                </div>
            )}
        </div>
    )
}

// 2. Halaman Utama yang membungkus konten dengan Suspense
export default function VerificationPage() {
    return (
        <main style={{ background: '#FAFAFF', minHeight: '100vh', padding: '100px 24px' }}>
            <Navbar />
            <Suspense fallback={<div style={{ textAlign: 'center', marginTop: '100px' }}>Loading Verifier... ⏳</div>}>
                <VerifyContent />
            </Suspense>
        </main>
    )
}