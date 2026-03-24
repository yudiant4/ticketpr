'use client'

import Link from 'next/link'
import { parseEther } from 'viem'
import { useEvents, useMintTicket } from '@/hooks/useTicketPro'
import Navbar from '../components/Navbar'

export default function MarketPage() {
  const { data: events } = useEvents()
  const { mintTicket, isPending } = useMintTicket()

  return (
    <main style={{ background: '#FAFAFF', minHeight: '100vh', padding: '100px 48px' }}>
      <Navbar />
      <h1 style={{ fontWeight: 800, fontSize: '32px', marginBottom: '40px' }}>Available Events 🎫</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {events?.map((event: any) => (
          <div key={event.id.toString()} style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #E8E4F5' }}>
            <img src={event.ipfsHash.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')} style={{ width: '100%', borderRadius: '16px', marginBottom: '16px' }} />
            <h3 style={{ fontWeight: 800 }}>{event.name}</h3>
            <p style={{ color: '#9896B0', fontSize: '14px' }}>{event.location}</p>
            <div style={{ marginTop: '20px', fontWeight: 700, color: '#7C3AED' }}>{event.price} ETH</div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              {/* PERBAIKAN: toString() pada URL */}
              <Link href={`/events/${event.id.toString()}`} style={{ flex: 1, textAlign: 'center', padding: '12px', background: '#F3F0FF', borderRadius: '12px', textDecoration: 'none', color: '#7C3AED', fontWeight: 700 }}>
                Details
              </Link>

              {/* PERBAIKAN: parseEther pada Value */}
              <button
                onClick={() => mintTicket(event.id, { value: parseEther(event.price) })}
                disabled={isPending}
                style={{ flex: 1, padding: '12px', background: '#7C3AED', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                {isPending ? '...' : 'Mint'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}