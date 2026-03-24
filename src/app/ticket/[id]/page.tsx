'use client'

// Wajib agar data dari Smart Contract terbaca dinamis di Vercel
export const dynamic = 'force-dynamic';

import Link from 'next/link'
import { useAccount } from 'wagmi'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const { isConnected } = useAccount()

  return (
    <main style={{ background: '#FAFAFF', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <Navbar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '120px 24px 80px' }}>

        {/* BREADCRUMB / BACK BUTTON */}
        <Link href="/market" style={{
          textDecoration: 'none',
          color: '#7C3AED',
          fontWeight: 700,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '32px',
          fontSize: '14px'
        }}>
          ← Back to Marketplace 🛒
        </Link>

        {/* MAIN CONTENT GRID */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px',
          alignItems: 'start'
        }}>

          {/* BAGIAN KIRI: VISUAL TIKET (POSTER) */}
          <div style={{
            background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
            borderRadius: '32px',
            height: '480px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '120px',
            boxShadow: '0 20px 40px rgba(124, 58, 237, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 2px, transparent 2px)', backgroundSize: '30px 30px' }} />
            <span style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }}>🎟️</span>
          </div>

          {/* BAGIAN KANAN: INFO TIKET */}
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '32px',
            border: '1px solid #E8E4F5',
            boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 800,
              color: '#10B981',
              background: '#ECFDF5',
              padding: '6px 12px',
              borderRadius: '50px',
              marginBottom: '20px',
              textTransform: 'uppercase'
            }}>
              Verified Event ✅
            </div>

            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0F0A1E', marginBottom: '12px', lineHeight: 1.2 }}>
              VIP Access Ticket #{params.id} 💎
            </h1>

            <p style={{ color: '#4B4869', fontSize: '15px', lineHeight: 1.6, marginBottom: '32px' }}>
              This is a premium NFT ticket for the upcoming event. Fully verified on the blockchain, granting you exclusive access to the venue.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#0F0A1E', fontWeight: 600 }}>
                <span style={{ fontSize: '18px' }}>📅</span> 28 March 2026
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#0F0A1E', fontWeight: 600 }}>
                <span style={{ fontSize: '18px' }}>📍</span> Jakarta International Stadium
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#0F0A1E', fontWeight: 600 }}>
                <span style={{ fontSize: '18px' }}>🛡️</span> Authentic NFT Secured
              </div>
            </div>

            {/* BOX HARGA */}
            <div style={{
              background: '#F3F0FF',
              padding: '24px',
              borderRadius: '20px',
              marginBottom: '32px',
              border: '1px solid rgba(124, 58, 237, 0.1)'
            }}>
              <div style={{ fontSize: '13px', color: '#7C3AED', fontWeight: 700, marginBottom: '4px' }}>Mint Price 🏷️</div>
              <div style={{ fontSize: '32px', fontWeight: 800, color: '#7C3AED' }}>0.05 ETH <span style={{ fontSize: '16px', color: '#9896B0', fontWeight: 500 }}>≈ $180.00</span></div>
            </div>

            {/* TOMBOL AKSI */}
            {isConnected ? (
              <button style={{
                width: '100%',
                padding: '18px',
                background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                color: 'white',
                borderRadius: '16px',
                border: 'none',
                fontWeight: 800,
                fontSize: '16px',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(124, 58, 237, 0.3)',
                transition: '0.3s'
              }}>
                Mint My Ticket 🚀
              </button>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p style={{ marginBottom: '15px', color: '#9896B0', fontSize: '14px' }}>Please connect wallet to mint 🔑</p>
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