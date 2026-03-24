'use client'

export const dynamic = 'force-dynamic';

import Link from 'next/link'
import { useEvents, useMintTicket } from '@/hooks/useTicketPro'
import Navbar from '../components/Navbar'

export default function MarketPage() {
  // 1. Gunakan 'mint' (sesuai Hook Turn 30)
  const { data: events, isLoading } = useEvents()
  const { mint, isPending } = useMintTicket()

  return (
    <main style={{ background: '#FAFAFF', minHeight: '100vh', padding: '100px 48px' }}>
      <Navbar />
      <h1 style={{ fontWeight: 800, fontSize: '32px', marginBottom: '40px' }}>Available Events 🎫</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {isLoading ? (
          <p>Loading events from blockchain... ⏳</p>
        ) : (events as any[])?.length === 0 ? (
          <p>No events found. Go create one! 🚀</p>
        ) : (events as any[])?.map((event: any) => (
          <div key={event.id.toString()} style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #E8E4F5', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <img
              src={event.ipfsHash?.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px', marginBottom: '16px' }}
              alt={event.name}
            />
            <h3 style={{ fontWeight: 800, fontSize: '20px', margin: '0 0 8px' }}>{event.name}</h3>
            <p style={{ color: '#9896B0', fontSize: '14px', margin: 0 }}>📍 {event.location}</p>

            <div style={{ marginTop: '20px', padding: '12px', background: '#FAFAFF', borderRadius: '12px', fontWeight: 700, color: '#7C3AED', textAlign: 'center' }}>
              {/* Menangani jika harga sudah dalam BigInt atau masih string */}
              {typeof event.price === 'bigint' ? (Number(event.price) / 1e18).toString() : event.price} ETH
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Link
                href={`/events/${event.id.toString()}`}
                style={{ flex: 1, textAlign: 'center', padding: '12px', background: '#F3F0FF', borderRadius: '12px', textDecoration: 'none', color: '#7C3AED', fontWeight: 700, fontSize: '14px' }}
              >
                Details
              </Link>

              <button
                // PERBAIKAN: Panggil 'mint' dengan format sederhana
                onClick={() => mint(event.id, event.price)}
                disabled={isPending}
                style={{ flex: 1, padding: '12px', background: '#7C3AED', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: isPending ? 'not-allowed' : 'pointer', fontSize: '14px' }}
              >
                {isPending ? '⏳...' : 'Mint'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}