'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/contracts/config'

export default function VerifyPage() {
  const { isConnected } = useAccount()
  const [tokenId, setTokenId] = useState('')
  const [verifyResult, setVerifyResult] = useState<'valid' | 'used' | 'invalid' | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [ticketData, setTicketData] = useState<any>(null)
  const [showQR, setShowQR] = useState(false)
  const [qrTokenId, setQrTokenId] = useState('')

  const { data: ticket, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getTicket',
    args: [BigInt(tokenId || '0')],
    chainId: sepolia.id,
    query: { enabled: false },
  })

  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleVerify = async () => {
    if (!tokenId) return
    setIsVerifying(true)
    setVerifyResult(null)

    try {
      const result = await refetch()
      if (result.data) {
        const t = result.data as any
        setTicketData(t)
        setVerifyResult(t.used ? 'used' : 'valid')
      } else {
        setVerifyResult('invalid')
      }
    } catch {
      setVerifyResult('invalid')
    }
    setIsVerifying(false)
  }

  const handleMarkUsed = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'useTicket',
      args: [BigInt(tokenId)],
      chainId: sepolia.id,
    })
  }

  useEffect(() => {
    if (isSuccess) setVerifyResult('used')
  }, [isSuccess])

  const resultConfig = {
    valid: { color: '#16A34A', bg: '#DCFCE7', border: '#BBF7D0', icon: '✅', title: 'Valid Ticket!', sub: 'This ticket is authentic and has not been used.' },
    used: { color: '#D97706', bg: '#FEF3C7', border: '#FDE68A', icon: '⚠️', title: 'Already Used', sub: 'This ticket has already been scanned and used.' },
    invalid: { color: '#DC2626', bg: '#FEE2E2', border: '#FECACA', icon: '❌', title: 'Invalid Ticket', sub: 'This ticket does not exist or is not valid.' },
  }

  return (
    <main style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', background: '#FAFAFF', minHeight: '100vh', color: '#0F0A1E' }}>

      {/* NAVBAR */}
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
      <div style={{ background: 'linear-gradient(135deg,#0F0A1E,#1a0f3d)', padding: '48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(124,58,237,0.3) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔐</div>
          <h1 style={{ fontSize: '40px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>Ticket Verification</h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)' }}>Verify NFT tickets on Sepolia blockchain in real-time</p>
        </div>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 48px' }}>

        {/* VERIFY PANEL */}
        <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '24px', padding: '40px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            🔍 Verify by Token ID
          </h2>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input
              value={tokenId}
              onChange={e => { setTokenId(e.target.value); setVerifyResult(null) }}
              placeholder="Enter Token ID (e.g. 1)"
              style={{ flex: 1, padding: '14px 18px', border: '1.5px solid #E8E4F5', borderRadius: '14px', fontSize: '16px', outline: 'none', fontFamily: 'inherit' }}
            />
            <button
              onClick={handleVerify}
              disabled={isVerifying || !tokenId}
              style={{ padding: '14px 28px', background: isVerifying ? '#A855F7' : 'linear-gradient(135deg,#7C3AED,#A855F7)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 700, cursor: isVerifying ? 'not-allowed' : 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
              {isVerifying ? '⏳ Checking...' : '🔍 Verify Now'}
            </button>
          </div>

          {/* RESULT */}
          {verifyResult && (
            <div style={{ background: resultConfig[verifyResult].bg, border: `1.5px solid ${resultConfig[verifyResult].border}`, borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <div style={{ fontSize: '48px' }}>{resultConfig[verifyResult].icon}</div>
                <div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: resultConfig[verifyResult].color }}>{resultConfig[verifyResult].title}</div>
                  <div style={{ fontSize: '14px', color: resultConfig[verifyResult].color, opacity: 0.8 }}>{resultConfig[verifyResult].sub}</div>
                </div>
              </div>

              {ticketData && (
                <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#9896B0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Ticket Details (On-chain)</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    {[
                      { label: 'Token ID', val: `#${tokenId}` },
                      { label: 'Tier', val: ticketData.tier },
                      { label: 'Event ID', val: `#${ticketData.eventId?.toString()}` },
                      { label: 'Status', val: ticketData.used ? '✅ Used' : '🟢 Valid' },
                      { label: 'Original Owner', val: `${ticketData.originalOwner?.slice(0,8)}...` },
                      { label: 'Network', val: 'Sepolia' },
                    ].map((item, i) => (
                      <div key={i}>
                        <div style={{ fontSize: '11px', color: '#9896B0', marginBottom: '2px' }}>{item.label}</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F0A1E' }}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {verifyResult === 'valid' && isConnected && (
                <button
                  onClick={handleMarkUsed}
                  disabled={isPending}
                  style={{ marginTop: '16px', width: '100%', padding: '14px', background: '#16A34A', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: isPending ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                  {isPending ? '⏳ Processing...' : '✅ Mark as Used & Allow Entry'}
                </button>
              )}
            </div>
          )}

          {/* QR GENERATOR */}
          <div style={{ borderTop: '1px solid #E8E4F5', paddingTop: '24px', marginTop: '8px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>📱 Generate QR Code for Your Ticket</h3>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input value={qrTokenId} onChange={e => setQrTokenId(e.target.value)}
                placeholder="Enter your Token ID"
                style={{ flex: 1, padding: '12px 16px', border: '1.5px solid #E8E4F5', borderRadius: '12px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
              <button onClick={() => setShowQR(true)} disabled={!qrTokenId}
                style={{ padding: '12px 20px', background: '#F3F0FF', color: '#7C3AED', border: '1.5px solid rgba(124,58,237,0.2)', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Generate QR
              </button>
            </div>

            {showQR && qrTokenId && (
              <div style={{ marginTop: '20px', textAlign: 'center', padding: '24px', background: '#FAFAFF', borderRadius: '16px', border: '1px solid #E8E4F5' }}>
                {/* QR Code as SVG grid */}
                <div style={{ display: 'inline-block', padding: '16px', background: 'white', borderRadius: '12px', marginBottom: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
                  <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
                    <rect width="200" height="200" fill="white"/>
                    {/* Outer frame */}
                    <rect x="10" y="10" width="50" height="50" fill="none" stroke="#7C3AED" strokeWidth="8"/>
                    <rect x="140" y="10" width="50" height="50" fill="none" stroke="#7C3AED" strokeWidth="8"/>
                    <rect x="10" y="140" width="50" height="50" fill="none" stroke="#7C3AED" strokeWidth="8"/>
                    {/* Corner fills */}
                    <rect x="22" y="22" width="26" height="26" fill="#7C3AED"/>
                    <rect x="152" y="22" width="26" height="26" fill="#7C3AED"/>
                    <rect x="22" y="152" width="26" height="26" fill="#7C3AED"/>
                    {/* Data pattern - unique per tokenId */}
                    {Array.from({ length: 8 }, (_, row) =>
                      Array.from({ length: 8 }, (_, col) => {
                        const seed = (parseInt(qrTokenId) + row * 7 + col * 13) % 3
                        return seed === 0 ? (
                          <rect key={`${row}-${col}`}
                            x={75 + col * 10} y={75 + row * 10}
                            width="8" height="8" fill="#7C3AED"/>
                        ) : null
                      })
                    )}
                    {/* Token ID text */}
                    <text x="100" y="195" textAnchor="middle" fontSize="10" fill="#9896B0" fontFamily="monospace">TKP #{qrTokenId}</text>
                  </svg>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F0A1E', marginBottom: '4px' }}>Token #{qrTokenId} QR Code</div>
                <div style={{ fontSize: '12px', color: '#9896B0', marginBottom: '16px' }}>Show this at the event gate for verification</div>
                <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#7C3AED', background: '#F3F0FF', padding: '8px 14px', borderRadius: '8px', display: 'inline-block' }}>
                  {CONTRACT_ADDRESS.slice(0,20)}.../{qrTokenId}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '24px', padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '20px' }}>⚡ How Verification Works</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
            {[
              { icon: '📱', title: 'Fan shows QR', desc: 'Ticket holder shows their NFT QR code at the gate' },
              { icon: '🔍', title: 'Gate scans & verifies', desc: 'Staff enters Token ID to verify on blockchain' },
              { icon: '✅', title: 'Mark as used', desc: 'Valid ticket gets marked as used on-chain permanently' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{s.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F0A1E', marginBottom: '6px' }}>{s.title}</div>
                <div style={{ fontSize: '13px', color: '#9896B0', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}