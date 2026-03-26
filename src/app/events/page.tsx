'use client'

export const dynamic = 'force-dynamic';

import Link from 'next/link'
import { useEvents, useMintTicket } from '@/hooks/useTicketPro'
import Navbar from '../components/Navbar'

export default function MarketPage() {
  const { data: events, isLoading } = useEvents()

  const { mintTicket, isPending } = useMintTicket()

  // Mencegah crash jika events bukan array
  const eventList = Array.isArray(events) ? events : [];

  // PERBAIKAN FILTER: Hanya ambil event yang berstatus "active" dan namanya tidak kosong
  const activeEvents = eventList.filter((event: any) => event.active === true && event.name !== "");

  return (
    <main style={{ background: '#FAFAFF', minHeight: '100vh', padding: '100px 48px' }}>
      <Navbar />
      <h1 style={{ fontWeight: 800, fontSize: '32px', marginBottom: '40px' }}>Available Events 🎫</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {isLoading ? (
          <p>Loading events from blockchain... ⏳</p>
        ) : activeEvents.length === 0 ? (
          <div style={{ padding: '20px', background: '#FEE2E2', color: '#DC2626', borderRadius: '12px', gridColumn: '1 / -1' }}>
            <b>Info:</b> Belum ada event yang aktif di blockchain. Silakan klik menu "Create Event" untuk membuat event pertamamu!
          </div>
        ) : activeEvents.map((event: any) => (
          <div key={event.id?.toString()} style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #E8E4F5', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>

            {/* PERBAIKAN: Ganti ipfsHash jadi metadataURI sesuai Smart Contract */}
            <img
              src={
                event.metadataURI?.startsWith('ipfs://')
                  ? event.metadataURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')
                  : `https://gateway.pinata.cloud/ipfs/${event.metadataURI}`
              }
            />

            <h3 style={{ fontWeight: 800, fontSize: '20px', margin: '0 0 8px' }}>{event.name}</h3>

            {/* PERBAIKAN: Ganti location jadi venue sesuai struct di Solidity */}
            <p style={{ color: '#9896B0', fontSize: '14px', margin: 0 }}>📍 {event.venue}</p>

            <div style={{ marginTop: '20px', padding: '12px', background: '#FAFAFF', borderRadius: '12px', fontWeight: 700, color: '#7C3AED', textAlign: 'center' }}>
              {typeof event.price === 'bigint' ? (Number(event.price) / 1e18).toString() : event.price} ETH
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <Link
                href={`/events/${event.id?.toString()}`}
                style={{ flex: 1, textAlign: 'center', padding: '12px', background: '#F3F0FF', borderRadius: '12px', textDecoration: 'none', color: '#7C3AED', fontWeight: 700, fontSize: '14px' }}
              >
                Details
              </Link>

              <button
                onClick={() => mintTicket(event.id, event.price)}
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