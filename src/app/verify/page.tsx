'use client'

// PERBAIKAN: Menambahkan force-dynamic agar build Vercel lancar
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function VerifyPage() {
    const [tokenId, setTokenId] = useState('')
    const [searchId, setSearchId] = useState<bigint | null>(null)
    const [isMobile, setIsMobile] = useState(false)

    // --- DETEKSI LAYAR HP ---
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // 1. Cek Pemilik Tiket (Owner) dari Smart Contract
    const { data: owner, isError: ownerError } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'ownerOf',
        args: searchId !== null ? [searchId] : undefined,
    })

    const handleVerify = () => {
        if (tokenId) {
            setSearchId(BigInt(tokenId))
        }
    }

    return (
        <main style={{ background: '#FAFAFF', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, sans-serif', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            {/* HEADER */}
            <div style={{
                background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
                padding: isMobile ? '40px 20px' : '80px 48px',
                textAlign: 'center',
                color: 'white',
                marginTop: '72px'
            }}>
                <h1 style={{ fontSize: isMobile ? '28px' : '42px', fontWeight: 800 }}>🛡️ Ticket Verifier</h1>
                <p style={{ opacity: 0.9, fontSize: '16px' }}>Verify NFT ticket authenticity instantly on-chain ⛓️</p>
            </div>

            <div style={{ maxWidth: '600px', width: '100%', margin: '-40px auto 80px', padding: '0 20px', flex: 1 }}>

                {/* INPUT BOX */}
                <div style={{
                    background: 'white',
                    padding: isMobile ? '25px' : '40px',
                    borderRadius: '28px',
                    boxShadow: '0 20px 50px rgba(124, 58, 237, 0.1)',
                    border: '1px solid #E8E4F5'
                }}>
                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '12px', color: '#4B4869' }}>Enter Ticket ID 🎫</label>
                    <div style={{ display: 'flex', gap: '12px', flexDirection: isMobile ? 'column' : 'row' }}>
                        <input
                            type="number"
                            placeholder="e.g. 1"
                            value={tokenId}
                            onChange={(e) => setTokenId(e.target.value)}
                            style={{
                                flex: 1,
                                padding: '16px',
                                borderRadius: '14px',
                                border: '2px solid #F3F0FF',
                                outline: 'none',
                                fontSize: '16px',
                                background: '#FAFAFF',
                                fontFamily: 'inherit'
                            }}
                        />
                        <button
                            onClick={handleVerify}
                            style={{
                                padding: '16px 32px',
                                background: 'linear-gradient(135deg, #7C3AED, #A855F7)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '14px',
                                fontWeight: 800,
                                cursor: 'pointer',
                                fontSize: '16px',
                                boxShadow: '0 8px 20px rgba(124, 58, 237, 0.3)'
                            }}
                        >
                            Verify Now 🔍
                        </button>
                    </div>
                </div>

                {/* VERIFICATION RESULT */}
                {searchId !== null && (
                    <div style={{ marginTop: '40px', textAlign: 'center' }}>
                        {owner && !ownerError ? (
                            <div style={{
                                background: '#ECFDF5',
                                border: '2px solid #10B981',
                                padding: '32px',
                                borderRadius: '28px'
                            }}>
                                <div style={{ fontSize: '56px', marginBottom: '15px' }}>✅</div>
                                <h2 style={{ color: '#065F46', fontWeight: 800, fontSize: '24px', marginBottom: '10px' }}>VALID TICKET</h2>
                                <p style={{ color: '#065F46', opacity: 0.8, marginBottom: '25px' }}>This ticket is verified and authentic ✨</p>

                                <div style={{ textAlign: 'left', background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                                    <div style={{ marginBottom: '12px' }}>
                                        <div style={{ fontSize: '12px', color: '#9896B0', fontWeight: 700, textTransform: 'uppercase' }}>Owner Address 👤</div>
                                        <div style={{ fontSize: '13px', fontFamily: 'monospace', wordBreak: 'break-all', color: '#0F0A1E', marginTop: '4px' }}>{owner as string}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#9896B0', fontWeight: 700, textTransform: 'uppercase' }}>Ticket Status 🎫</div>
                                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#10B981', marginTop: '4px' }}>Authentic NFT Verified</div>
                                    </div>
                                </div>
                            </div>
                        ) : ownerError ? (
                            <div style={{
                                background: '#FEF2F2',
                                border: '2px solid #EF4444',
                                padding: '32px',
                                borderRadius: '28px'
                            }}>
                                <div style={{ fontSize: '56px', marginBottom: '15px' }}>❌</div>
                                <h2 style={{ color: '#991B1B', fontWeight: 800, fontSize: '24px', marginBottom: '10px' }}>INVALID TICKET</h2>
                                <p style={{ color: '#991B1B', opacity: 0.8 }}>Ticket ID #{searchId.toString()} was not found on the blockchain 🛡️</p>
                            </div>
                        ) : (
                            <div style={{ color: '#9896B0', padding: '20px' }}>Searching on blockchain... ⛓️</div>
                        )}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    )
}