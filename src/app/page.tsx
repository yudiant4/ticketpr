import Navbar from '@/components/layout/Navbar'

export default function Home() {
  return (
    <main>
      <Navbar />
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '90vh', fontSize: '24px', fontWeight: 700,
        color: '#7C3AED'
      }}>
        🎟️ TicketPro is working!
      </div>
    </main>
  )
}