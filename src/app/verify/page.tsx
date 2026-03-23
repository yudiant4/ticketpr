'use client'

import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function VerifyPage() {
  return (
    <main>
      <Navbar />
      {/* ... Konten Verify ... */}
      <Footer />
    </main>
  )
}

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

  // 1. Cek Pemilik Tiket (Owner)
  const { data: owner, isError: ownerError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'ownerOf',
    args: searchId !== null ? [searchId] : undefined,
  })

  // 2. Cek Detail Tiket (Metadata)
  const { data: ticketDetail } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getEventDetails', // Mengambil data event dari ID tersebut
    args: searchId !== null ? [searchId] : undefined, // Asumsi ID Tiket nyambung ke ID Event
  })

  const handleVerify = () => {
    if (tokenId) {
      setSearchId(BigInt(tokenId))
    }
  }

  return (
    <main style={{ background: '#FAFAFF', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <Navbar />

      {/* HEADER */}
      <div style={{
        background: 'linear-gradient(135deg, #7C3AED, #4F46E5)',
        padding: isMobile ? '40px 20px' : '60px 48px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{ fontSize: isMobile ? '28px' : '36px', fontWeight: 800 }}>🛡️ Ticket Verifier</h1>
        <p style={{ opacity: 0.8 }}>Verify NFT ticket authenticity on-chain</p>
      </div>

      <div style={{ maxWidth: '600px', margin: '-30px auto 0', padding: '0 20px' }}>
        {/* INPUT BOX */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '24px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
          border: '1px solid #E8E4F5'
        }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Enter Token ID</label>
          <div style={{ display: 'flex', gap: '10px', flexDirection: isMobile ? 'column' : 'row' }}>
            <input
              type="number"
              placeholder="e.g. 1"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              style={{
                flex: 1,
                padding: '14px',
                borderRadius: '12px',
                border: '1.5px solid #E8E4F5',
                outline: 'none',
                fontSize: '16px'
              }}
            />
            <button
              onClick={handleVerify}
              style={{
                padding: '14px 28px',
                background: '#7C3AED',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Check Ticket
            </button>
          </div>
        </div>

        {/* VERIFICATION RESULT */}
        {searchId !== null && (
          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            {owner && !ownerError ? (
              <div style={{
                background: '#ECFDF5',
                border: '2px solid #10B981',
                padding: '30px',
                borderRadius: '24px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
                <h2 style={{ color: '#065F46', fontWeight: 800 }}>VALID TICKET</h2>
                <div style={{ marginTop: '20px', textAlign: 'left', fontSize: '14px', color: '#065F46' }}>
                  <div style={{ marginBottom: '8px' }}>👤 <b>Owner:</b> <br /> <span style={{ fontSize: '11px', fontFamily: 'monospace' }}>{owner as string}</span></div>
                  <div>🎫 <b>Status:</b> Authentic NFT</div>
                </div>
              </div>
            ) : ownerError ? (
              <div style={{
                background: '#FEF2F2',
                border: '2px solid #EF4444',
                padding: '30px',
                borderRadius: '24px'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>❌</div>
                <h2 style={{ color: '#991B1B', fontWeight: 800 }}>INVALID TICKET</h2>
                <p style={{ color: '#991B1B', fontSize: '14px' }}>Ticket ID #{searchId.toString()} not found or fake.</p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* INFO BUAT PANITIA */}
      <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '40px', color: '#9896B0', fontSize: '12px' }}>
        TicketPro Blockchain Verification System v1.0
      </div>
    </main>
  )
}