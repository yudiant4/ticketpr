'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useCreateEvent } from '@/hooks/useTicketPro'
import { parseEther } from "viem";

export default function CreateEventPage() {
  const { isConnected } = useAccount()
  const { createEvent, isPending, isConfirming, isSuccess, hash } = useCreateEvent()

  const [form, setForm] = useState({
    name: '',
    date: '',
    venue: '',
    city: '',
    price: '',
    maxSupply: '',
    royalty: '500',
    description: '',
    category: 'Music',
  })
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const categories = ['🎵 Music', '🎨 Art', '💻 Tech', '🏟️ Sports', '🎭 Theater', '🚀 Web3', '🕹️ Gaming']

  const validate = (currentStep: number) => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!form.name) newErrors.name = 'Event name is required'
      if (!form.date) newErrors.date = 'Date is required'
      if (!form.venue) newErrors.venue = 'Venue is required'
      if (!form.city) newErrors.city = 'City is required'
    } else if (currentStep === 2) {
      if (!form.price || parseFloat(form.price) <= 0) newErrors.price = 'Valid price required'
      if (!form.maxSupply || parseInt(form.maxSupply) <= 0) newErrors.maxSupply = 'Valid supply required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // --- PERBAIKAN DI SINI (handleSubmit) ---
  const handleSubmit = async () => {
    if (!validate(2)) return;
    if (!file) {
      alert("Please upload an event poster!");
      return;
    }

    setUploading(true);
    try {
      // 1. Upload ke Pinata
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/pinata", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const metadataURI = `ipfs://${data.ipfsHash}`;

      // Royalti dihapus dari pemanggilan karena Kontrak tidak memintanya
     await createEvent(
  form.name,                           // 1. Nama (Teks)
  form.date,                           // 2. Tanggal (Teks)
  `${form.venue}, ${form.city}`,       // 3. Lokasi (Teks)
  parseEther(form.price),              // 4. Harga (Wajib diconvert ke Wei/BigInt)
  BigInt(form.maxSupply),              // 5. Supply (Wajib BigInt)
  BigInt(form.royalty),                // 6. Royalty (Wajib BigInt)
  metadataURI                          // 7. Link Gambar Pinata (Teks)
);

    } catch (err) {
      console.error("Upload/Deploy failed:", err);
      alert("Failed to create event. Check console.");
    } finally {
      setUploading(false);
    }
  };

  const inputStyle = (field: string) => ({
    width: '100%', padding: '12px 16px',
    border: `1.5px solid ${errors[field] ? '#DC2626' : '#E8E4F5'}`,
    borderRadius: '12px', fontSize: '14px', color: '#0F0A1E',
    outline: 'none', fontFamily: 'inherit', background: 'white',
  })

  const labelStyle = {
    fontSize: '13px', fontWeight: 700, color: '#0F0A1E',
    display: 'block', marginBottom: '6px',
  }

  if (!isConnected) {
    return (
      <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', minHeight: '100vh', background: '#FAFAFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px' }}>
        <div style={{ fontSize: '64px' }}>🔐</div>
        <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F0A1E' }}>Connect Wallet to Create Event</div>
        <ConnectButton />
        <Link href="/" style={{ fontSize: '14px', color: '#7C3AED', textDecoration: 'none' }}>← Back to Home</Link>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', minHeight: '100vh', background: '#FAFAFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '24px', padding: '48px' }}>
        <div style={{ fontSize: '80px' }}>🎉</div>
        <div style={{ fontSize: '32px', fontWeight: 800, color: '#0F0A1E', textAlign: 'center' }}>Event Created on Blockchain!</div>
        <p style={{ fontSize: '16px', color: '#9896B0', textAlign: 'center', maxWidth: '400px', lineHeight: 1.7 }}>
          Your event <strong style={{ color: '#0F0A1E' }}>{form.name}</strong> has been deployed to Sepolia. Fans can now mint tickets!
        </p>
        {hash && (
          <a href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank"
            style={{ background: '#F3F0FF', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '12px', padding: '14px 24px', fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: '#7C3AED', textDecoration: 'none' }}>
            🔍 View on Etherscan →
          </a>
        )}
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/events" style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: 'white', padding: '14px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}>
            Browse Events →
          </Link>
          <Link href="/dashboard" style={{ background: 'white', border: '1.5px solid #E8E4F5', color: '#0F0A1E', padding: '14px 28px', borderRadius: '50px', fontSize: '15px', fontWeight: 700, textDecoration: 'none' }}>
            My Dashboard
          </Link>
        </div>
      </div>
    )
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
          <Link href="/" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Home</Link>
          <Link href="/events" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Explore</Link>
          <Link href="/dashboard" style={{ fontSize: '14px', fontWeight: 500, color: '#4B4869', textDecoration: 'none' }}>Dashboard</Link>
        </div>
        <ConnectButton />
      </nav>

      {/* PAGE HEADER */}
      <div style={{ background: 'linear-gradient(135deg,#7C3AED,#A855F7,#EC4899)', padding: '48px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.12) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '40px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>➕ Create NFT Event</h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.8)' }}>Deploy your event smart contract and start selling NFT tickets</p>
        </div>
      </div>

      {/* PROGRESS STEPS */}
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 48px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', marginBottom: '40px' }}>
          {['Event Info', 'Ticket Config', 'Review & Deploy'].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => i + 1 <= step && setStep(i + 1)}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: step > i + 1 ? '#7C3AED' : step === i + 1 ? 'linear-gradient(135deg,#7C3AED,#A855F7)' : 'white', border: `2px solid ${step >= i + 1 ? '#7C3AED' : '#E8E4F5'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: step >= i + 1 ? 'white' : '#9896B0', flexShrink: 0 }}>
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: step === i + 1 ? '#7C3AED' : '#9896B0', whiteSpace: 'nowrap' }}>{s}</span>
              </div>
              {i < 2 && <div style={{ flex: 1, height: '2px', background: step > i + 1 ? '#7C3AED' : '#E8E4F5', margin: '0 12px' }} />}
            </div>
          ))}
        </div>

        {/* FORM CONTAINER */}
        <div style={{ background: 'white', border: '1px solid #E8E4F5', borderRadius: '24px', padding: '40px', marginBottom: '32px' }}>

          {/* Step 1 — Event Info */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '24px' }}>📋 Event Information</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Event Name *</label>
                  <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Electronic Horizon Festival 2026"
                    style={inputStyle('name')} />
                  {errors.name && <div style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>{errors.name}</div>}
                </div>

                <div>
                  <label style={labelStyle}>Category *</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {categories.map((cat) => (
                      <button key={cat} onClick={() => setForm({ ...form, category: cat })}
                        style={{ padding: '8px 16px', borderRadius: '50px', border: `1.5px solid ${form.category === cat ? '#7C3AED' : '#E8E4F5'}`, background: form.category === cat ? '#F3F0FF' : 'white', color: form.category === cat ? '#7C3AED' : '#4B4869', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Event Date *</label>
                    <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                      style={inputStyle('date')} />
                    {errors.date && <div style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>{errors.date}</div>}
                  </div>
                  <div>
                    <label style={labelStyle}>City *</label>
                    <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                      placeholder="e.g. Jakarta"
                      style={inputStyle('city')} />
                    {errors.city && <div style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>{errors.city}</div>}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Venue *</label>
                  <input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })}
                    placeholder="e.g. JIEXPO Hall A, Kemayoran"
                    style={inputStyle('venue')} />
                  {errors.venue && <div style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>{errors.venue}</div>}
                </div>

                <div>
                  <label style={labelStyle}>Event Poster *</label>
                  <input type="file" accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    style={inputStyle('file')} />
                  {file && <div style={{ fontSize: '12px', color: '#7C3AED', marginTop: '4px' }}>✅ {file.name} selected</div>}
                </div>

                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe your event..."
                    rows={4}
                    style={{ ...inputStyle('description'), resize: 'vertical' }} />
                </div>
              </div>

              <button onClick={() => { if (validate(1)) setStep(2) }}
                style={{ marginTop: '32px', width: '100%', padding: '16px', background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
                Next: Ticket Config →
              </button>
            </div>
          )}

          {/* Step 2 — Ticket Config */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '24px' }}>🎫 Ticket Configuration</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Ticket Price (ETH) *</label>
                    <input type="number" step="0.001" value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      placeholder="e.g. 0.01"
                      style={inputStyle('price')} />
                    {errors.price && <div style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>{errors.price}</div>}
                  </div>
                  <div>
                    <label style={labelStyle}>Max Supply (tickets) *</label>
                    <input type="number" value={form.maxSupply}
                      onChange={e => setForm({ ...form, maxSupply: e.target.value })}
                      placeholder="e.g. 1000"
                      style={inputStyle('maxSupply')} />
                    {errors.maxSupply && <div style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px' }}>{errors.maxSupply}</div>}
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Secondary Sale Royalty</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['0', '250', '500', '750', '1000'].map((r) => (
                      <button key={r} onClick={() => setForm({ ...form, royalty: r })}
                        style={{ flex: 1, padding: '10px', borderRadius: '10px', border: `1.5px solid ${form.royalty === r ? '#7C3AED' : '#E8E4F5'}`, background: form.royalty === r ? '#F3F0FF' : 'white', color: form.royalty === r ? '#7C3AED' : '#4B4869', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        {parseInt(r) / 100}%
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9896B0', marginTop: '6px' }}>You earn {parseInt(form.royalty) / 100}% every time ticket is resold</div>
                </div>

                <div style={{ background: '#F3F0FF', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '16px', padding: '20px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#7C3AED', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Preview</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { label: 'Event Name', val: form.name || '—' },
                      { label: 'Date', val: form.date || '—' },
                      { label: 'Venue', val: form.venue ? `${form.venue}, ${form.city}` : '—' },
                      { label: 'Price', val: form.price ? `${form.price} ETH` : '—' },
                      { label: 'Max Supply', val: form.maxSupply ? `${form.maxSupply} tickets` : '—' },
                      { label: 'Royalty', val: `${parseInt(form.royalty) / 100}%` },
                    ].map((item, i) => (
                      <div key={i}>
                        <div style={{ fontSize: '11px', color: '#9896B0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '3px' }}>{item.label}</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F0A1E' }}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <button onClick={() => setStep(1)}
                  style={{ flex: 1, padding: '16px', background: 'white', color: '#0F0A1E', border: '1.5px solid #E8E4F5', borderRadius: '14px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ← Back
                </button>
                <button onClick={() => { if (validate(2)) setStep(3) }}
                  style={{ flex: 2, padding: '16px', background: 'linear-gradient(135deg,#7C3AED,#A855F7)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Next: Review & Deploy →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Review & Deploy */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '24px' }}>🚀 Review & Deploy to Blockchain</h2>

              <div style={{ background: '#FAFAFF', borderRadius: '16px', padding: '24px', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { label: '📛 Event Name', val: form.name },
                  { label: '🏷️ Category', val: form.category },
                  { label: '📅 Date', val: form.date },
                  { label: '📍 Location', val: `${form.venue}, ${form.city}` },
                  { label: '💰 Price', val: `${form.price} ETH` },
                  { label: '🎫 Max Supply', val: `${form.maxSupply} tickets` },
                  { label: '💸 Royalty', val: `${parseInt(form.royalty) / 100}%` },
                  { label: '🌐 Network', val: 'Sepolia Testnet' },
                  { label: '📋 Standard', val: 'ERC-721' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #E8E4F5' }}>
                    <span style={{ fontSize: '14px', color: '#9896B0' }}>{item.label}</span>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F0A1E' }}>{item.val}</span>
                  </div>
                ))}
              </div>

              <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '12px', padding: '16px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '20px' }}>⚠️</span>
                <div style={{ fontSize: '13px', color: '#92400E', lineHeight: 1.6 }}>
                  Deploying will send a transaction to Sepolia testnet. MetaMask will ask you to confirm. Gas fees apply (testnet ETH only).
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setStep(2)}
                  style={{ flex: 1, padding: '16px', background: 'white', color: '#0F0A1E', border: '1.5px solid #E8E4F5', borderRadius: '14px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ← Back
                </button>
                <button onClick={handleSubmit} disabled={uploading || isPending || isConfirming}
                  style={{ flex: 2, padding: '16px', background: uploading || isPending || isConfirming ? '#A855F7' : 'linear-gradient(135deg,#7C3AED,#A855F7)', color: 'white', border: 'none', borderRadius: '14px', fontSize: '16px', fontWeight: 800, cursor: uploading || isPending || isConfirming ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                  {uploading ? '📁 Uploading Image...' : isPending ? '⏳ Waiting for MetaMask...' : isConfirming ? '⛓️ Deploying...' : '🚀 Deploy Event to Blockchain'}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}