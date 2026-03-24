'use client'

export const dynamic = 'force-dynamic';

import Link from 'next/link'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  return (
    <main style={{ background: '#FAFAFF', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <Navbar />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '120px 20px' }}>
        <Link href="/market" style={{ textDecoration: 'none', color: '#7C3AED', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
          ← Back to Marketplace 🛒
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '48px' }}>
          {/* POSTER */}
          <div style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius: '32px', height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '100px', boxShadow: '0 20px 40px rgba(124, 58, 237, 0.15)' }}>
            🎟️
          </div>

          {/* INFO */}
          <div style={{ background: 'white', padding: '40px', borderRadius: '32px', border: '1px solid #E8E4F5' }}>
            <div style={{ color: '#7C3AED', fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', marginBottom: '10px' }}>Verified Event ✅</div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '20px' }}>Premium Ticket #{params.id} 💎</h1>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px', color: '#4B4869' }}>
               <span>📅 Date: <b>28 Mar 2026</b></span>
               <span>📍 Location: <b>Jakarta, Indonesia</b></span>
            </div>

            <div style={{ background: '#F3F0FF', padding: '24px', borderRadius: '20px', marginBottom: '32px' }}>
               <div style={{ fontSize: '13px', color: '#7C3AED', fontWeight: 700 }}>Mint Price</div>
               <div style={{ fontSize: '28px', fontWeight: 800 }}>0.05 ETH 💎</div>
            </div>

            <button style={{ width: '100%', padding: '18px', background: '#0F0A1E', color: 'white', borderRadius: '16px', border: 'none', fontWeight: 700, fontSize: '16px', cursor: 'pointer' }}>
              Mint My Ticket 🚀
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}