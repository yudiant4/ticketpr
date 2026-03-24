'use client'

export const dynamic = 'force-dynamic';

import Link from 'next/link'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/constants/contract'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const { isConnected } = useAccount()
  const { writeContract } = useWriteContract()

  return (
    <main style={{ background: '#FAFAFF', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '120px 48px' }}>
        <Link href="/market" style={{ textDecoration: 'none', color: '#7C3AED', fontWeight: 700 }}>
          ← Back to Market 🛒
        </Link>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px', marginTop: '32px' }}>
          <div style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius: '32px', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '120px' }}>
            🎟️
          </div>
          <div style={{ background: 'white', padding: '40px', borderRadius: '32px', border: '1px solid #E8E4F5' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '20px' }}>NFT Ticket #{params.id} 💎</h1>
            <div style={{ background: '#F3F0FF', padding: '24px', borderRadius: '20px', marginBottom: '32px' }}>
               <div style={{ fontSize: '13px', color: '#7C3AED', fontWeight: 700 }}>Price</div>
               <div style={{ fontSize: '28px', fontWeight: 800 }}>0.05 ETH</div>
            </div>
            {isConnected ? (
              <button style={{ width: '100%', padding: '18px', background: '#0F0A1E', color: 'white', borderRadius: '16px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                Mint Now 🚀
              </button>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: '15px' }}>Connect wallet to buy 🔑</p>
                <w3m-button />
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}