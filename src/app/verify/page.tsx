'use client'

export const dynamic = 'force-dynamic';

import { useSearchParams } from 'next/navigation'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import Navbar from '../components/Navbar'
import { useState } from 'react'

export default function VerificationPage() {
  const searchParams = useSearchParams()
  const tokenId = searchParams.get('tokenId')
  const [inputToken, setInputToken] = useState('')

  // Membaca data Tiket dari Blockchain berdasarkan Token ID
  const { data: ticket, isLoading, isError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getTicket',
    args: tokenId ? [BigInt(tokenId)] : undefined,
  })

  // Membaca detail Event terkait tiket tersebut
  const { data: event } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getEventDetails',
    args: ticket ? [(ticket as any).eventId] : undefined,
  })

  return (
    <main style={{ background: '#FAFAFF', minHeight: '100vh', padding: '100px 24px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <Navbar />
      
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontWeight: 800, fontSize: '32px', marginBottom: '10px' }}>Ticket Verification 🛡️</h1>
        <p style={{ color: '#9896B0', marginBottom: '40px' }}>Verify the authenticity of TicketPro NFTs</p>

        {/* INPUT MANUAL JIKA TIDAK SCAN QR */}
        {!tokenId && (
          <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #E8E4F5', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <label style={{ display: 'block', fontWeight: 700, marginBottom: '12px', textAlign: 'left' }}>Enter Ticket ID</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="number" 
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder="e.g. 1" 
                style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1.5px solid #F3F0FF', outline: 'none' }} 
              />
              <button 
                onClick={() => window.location.href = `/verification?tokenId=${inputToken}`}
                style={{ padding: '14px 24px', background: '#7C3AED', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                Verify
              </button>
            </div>
          </div>
        )}

        {/* HASIL VERIFIKASI */}
        {tokenId && (
          <div style={{ background: 'white', padding: '40px', borderRadius: '32px', border: '2px solid #E8E4F5', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
            {isLoading ? (
              <p>Verifying ticket on blockchain... ⏳</p>
            ) : ticket && (ticket as any).originalOwner !== "0x0000000000000000000000000000000000000000" ? (
              <div className="fade-in">
                <div style={{ width: '80px', height: '80px', background: '#DCFCE7', color: '#16A34A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 24px' }}>✓</div>
                <h2 style={{ fontWeight: 800, fontSize: '24px', color: '#16A34A' }}>Authentic Ticket</h2>
                <p style={{ color: '#9896B0', marginTop: '4px' }}>This NFT is a valid TicketPro asset.</p>

                <div style={{ marginTop: '32px', padding: '24px', background: '#FAFAFF', borderRadius: '20px', textAlign: 'left', border: '1px solid #F3F0FF' }}>
                  <div style={{ marginBottom: '12px' }}>🎫 <b>Ticket ID:</b> #{tokenId}</div>
                  <div style={{ marginBottom: '12px' }}>🏁 <b>Event:</b> {(event as any)?.name || 'Loading...'}</div>
                  <div style={{ marginBottom: '12px' }}>🎖️ <b>Tier:</b> {(ticket as any).tier}</div>
                  <div style={{ marginBottom: '12px' }}>👤 <b>Original Owner:</b> <span style={{ fontSize: '12px', color: '#7C3AED' }}>{(ticket as any).originalOwner}</span></div>
                  <div style={{ 
                    marginTop: '15px', 
                    padding: '8px', 
                    background: (ticket as any).used ? '#FEE2E2' : '#DCFCE7', 
                    color: (ticket as any).used ? '#DC2626' : '#16A34A', 
                    borderRadius: '8px', 
                    textAlign: 'center', 
                    fontWeight: 800,
                    fontSize: '14px'
                  }}>
                    { (ticket as any).used ? 'ALREADY USED ❌' : 'VALID FOR ENTRY ✅' }
                  </div>
                </div>

                <button 
                  onClick={() => window.location.href = '/verification'}
                  style={{ marginTop: '30px', background: 'none', border: 'none', color: '#9896B0', cursor: 'pointer', fontWeight: 600 }}
                >
                  ← Verify Another Ticket
                </button>
              </div>
            ) : (
              <div>
                <div style={{ width: '80px', height: '80px', background: '#FEE2E2', color: '#DC2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 24px' }}>✕</div>
                <h2 style={{ fontWeight: 800, fontSize: '24px', color: '#DC2626' }}>Invalid Ticket</h2>
                <p style={{ color: '#9896B0', marginTop: '4px' }}>We couldn't find this ticket on the blockchain.</p>
                <button onClick={() => window.location.href = '/verification'} style={{ marginTop: '30px', padding: '12px 24px', background: '#0F0A1E', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Try Again</button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}