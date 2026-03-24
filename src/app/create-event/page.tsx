'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useCreateEvent } from '@/hooks/useTicketPro'
import Navbar from '../components/Navbar' // Pakai Navbar terpusat
import Footer from '../components/Footer'


export default function CreateEventPage() {
  const { isConnected } = useAccount()
  const { createEvent, isPending, isConfirming, isSuccess, hash } = useCreateEvent()
  const [isMobile, setIsMobile] = useState(false)

  // --- LOGIC DETEKSI HP ---
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [form, setForm] = useState({
    name: '', date: '', venue: '', city: '', price: '',
    maxSupply: '', royalty: '500', description: '', category: 'Music',
  })
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = ['🎵 Music', '🎨 Art', '💻 Tech', '🏟️ Sports', '🎭 Theater', '🚀 Web3', '🕹️ Gaming']

  const validate = (currentStep: number) => {
    const newErrors: Record<string, string> = {}
    if (currentStep === 1) {
      if (!form.name) newErrors.name = 'Required';
      if (!form.date) newErrors.date = 'Required';
      if (!form.venue) newErrors.venue = 'Required';
      if (!form.city) newErrors.city = 'Required';
    } else if (currentStep === 2) {
      if (!form.price || parseFloat(form.price) <= 0) newErrors.price = 'Invalid';
      if (!form.maxSupply || parseInt(form.maxSupply) <= 0) newErrors.maxSupply = 'Invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async () => {
    if (!validate(2)) return;
    if (!file) { alert("Upload poster!"); return; }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/pinata", { method: "POST", body: formData });
      const data = await res.json();
      const metadataURI = `ipfs://${data.ipfsHash}`;

      await createEvent(
        form.name, form.date, `${form.venue}, ${form.city}`,
        form.price, BigInt(form.maxSupply), BigInt(form.royalty), metadataURI
      );
    } catch (err) {
      alert("Failed to create event.");
    } finally { setUploading(false); }
  };

  const inputStyle = (field: string) => ({
    width: '100%', padding: '12px 16px',
    border: `1.5px solid ${errors[field] ? '#DC2626' : '#E8E4F5'}`,
    borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'white',
  })

  if (!isConnected) {
    return (
      <div style={{ minHeight: '100vh', background: '#FAFAFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '20px', padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px' }}>🔐</div>
        <div style={{ fontSize: '20px', fontWeight: 800 }}>Connect Wallet to Create Event</div>
        <w3m-button />
      </div>
    )
  }

  return (
    <main style={{ background: '#FAFAFF', minHeight: '100vh', color: '#0F0A1E', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <Navbar />

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)', padding: isMobile ? '40px 20px' : '60px 48px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: isMobile ? '28px' : '40px', fontWeight: 800, color: 'white' }}>➕ Create Event</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Sell your NFT tickets on the blockchain</p>
        </div>
      </div>

      {/* PROGRESS BAR (Responsive) */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: isMobile ? '20px 16px' : '32px 48px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          {['Info', 'Config', 'Review'].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: step >= i + 1 ? '#7C3AED' : 'white', border: '2px solid #7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: step >= i + 1 ? 'white' : '#7C3AED', fontWeight: 800, fontSize: '12px' }}>{i + 1}</div>
                {!isMobile && <span style={{ fontSize: '13px', fontWeight: 600 }}>{s}</span>}
              </div>
              {i < 2 && <div style={{ flex: 1, height: '2px', background: step > i + 1 ? '#7C3AED' : '#E8E4F5', margin: '0 10px' }} />}
            </div>
          ))}
        </div>

        {/* FORM CONTAINER */}
        <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '24px', padding: isMobile ? '24px 20px' : '40px' }}>

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>📋 Event Info</h2>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Event Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle('name')} placeholder="Music Fest" />
              </div>

              {/* Responsive Grid: 2 Col di Laptop, 1 Col di HP */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Date</label>
                  <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inputStyle('date')} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>City</label>
                  <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={inputStyle('city')} placeholder="Jakarta" />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Poster Image</label>
                <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} style={inputStyle('file')} />
              </div>

              <button onClick={() => validate(1) && setStep(2)} style={{ width: '100%', padding: '16px', background: '#7C3AED', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 700, marginTop: '20px', cursor: 'pointer' }}>
                Next: Ticket Config →
              </button>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>🎫 Ticket Config</h2>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Price (ETH)</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} style={inputStyle('price')} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>Total Supply</label>
                  <input type="number" value={form.maxSupply} onChange={e => setForm({ ...form, maxSupply: e.target.value })} style={inputStyle('maxSupply')} />
                </div>
              </div>

              <div style={{ background: '#F3F0FF', padding: '20px', borderRadius: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#7C3AED', marginBottom: '10px' }}>PREVIEW</p>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                  <div><b>Name:</b> {form.name}</div>
                  <div><b>Price:</b> {form.price} ETH</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #E8E4F5', background: 'none' }}>Back</button>
                <button onClick={() => validate(2) && setStep(3)} style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', background: '#7C3AED', color: 'white', fontWeight: 700 }}>Next Step</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800 }}>🚀 Review</h2>
              <div style={{ background: '#FAFAFF', padding: '20px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Event:</span> <b>{form.name}</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Price:</span> <b>{form.price} ETH</b></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Supply:</span> <b>{form.maxSupply}</b></div>
              </div>

              <button onClick={handleSubmit} disabled={uploading || isPending} style={{ width: '100%', padding: '16px', background: '#7C3AED', color: 'white', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer' }}>
                {uploading ? 'Uploading...' : isPending ? 'Waiting MetaMask...' : 'Deploy to Blockchain'}
              </button>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}