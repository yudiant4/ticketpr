'use client'

// Wajib agar build Vercel lancar
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useCreateEvent } from '@/hooks/useTicketPro'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function CreateEventPage() {
    const { isConnected } = useAccount()
    const { createEvent, isPending, isConfirming, isSuccess } = useCreateEvent()
    const [isMobile, setIsMobile] = useState(false)
    const [step, setStep] = useState(1)

    // Form State Lengkap
    const [form, setForm] = useState({
        name: '',
        date: '',
        venue: '',
        city: '',
        category: 'Music 🎵',
        description: '', // Deskripsi kembali hadir
        price: '',
        maxSupply: '',
        royalty: '500', // 5%
    })
    
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const categories = ['Music 🎵', 'Art 🎨', 'Tech 💻', 'Sports 🏟️', 'Theater 🎭', 'Web3 🌐', 'Gaming 🎮']

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        handleResize(); window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const validate = (currentStep: number) => {
        const newErrors: Record<string, string> = {}
        if (currentStep === 1) {
            if (!form.name) newErrors.name = 'Required';
            if (!form.date) newErrors.date = 'Required';
            if (!form.city) newErrors.city = 'Required';
            if (!form.description) newErrors.description = 'Required'; // Validasi deskripsi
        } else if (currentStep === 2) {
            if (!form.price || parseFloat(form.price) <= 0) newErrors.price = 'Invalid';
            if (!form.maxSupply || parseInt(form.maxSupply) <= 0) newErrors.maxSupply = 'Invalid';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async () => {
        if (!validate(2)) return;
        if (!file) { alert("Please upload a poster image 🖼️"); return; }
        
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/pinata", { method: "POST", body: formData });
            const data = await res.json();
            const metadataURI = `ipfs://${data.ipfsHash}`;

            await createEvent(
                form.name,
                form.date,
                `${form.venue}, ${form.city}`,
                form.price || '0',
                BigInt(form.maxSupply || '0'),
                BigInt(form.royalty || '500'),
                metadataURI
            );
        } catch (err) {
            alert("Failed to create event. Please check connection 🌐");
        } finally { setUploading(false); }
    };

    const inputStyle = (field: string) => ({
        width: '100%', padding: '14px 16px',
        border: `2px solid ${errors[field] ? '#EF4444' : '#F3F0FF'}`,
        borderRadius: '14px', fontSize: '15px', outline: 'none', background: 'white',
        fontFamily: 'inherit', transition: '0.3s'
    })

    if (!isConnected) {
        return (
            <div style={{ minHeight: '100vh', background: '#FAFAFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '60px' }}>⚠️</div>
                <h2 style={{ fontWeight: 800, margin: '20px 0' }}>Connect Wallet to Create Event</h2>
                <w3m-button />
            </div>
        )
    }

    return (
        <main style={{ background: '#FAFAFF', minHeight: '100vh', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            <Navbar />

            <div style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)', padding: isMobile ? '40px 20px' : '80px 48px', marginTop: '72px' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', color: 'white' }}>
                    <h1 style={{ fontSize: isMobile ? '32px' : '42px', fontWeight: 800 }}>Create New Event ✨</h1>
                    <p style={{ opacity: 0.9 }}>Fill in the details to launch your NFT ticketing smart contract 🚀</p>
                </div>
            </div>

            <div style={{ maxWidth: '850px', margin: '-40px auto 100px', padding: '0 20px' }}>
                
                {/* Stepper */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
                  {[1, 2, 3].map(s => (
                    <div key={s} style={{ flex: 1, height: '6px', background: step >= s ? '#7C3AED' : '#E8E4F5', borderRadius: '10px' }}></div>
                  ))}
                </div>

                <div style={{ background: 'white', padding: isMobile ? '24px' : '40px', borderRadius: '32px', boxShadow: '0 20px 50px rgba(0,0,0,0.05)', border: '1px solid #E8E4F5' }}>
                    
                    {/* STEP 1: INFO */}
                    {step === 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <h2 style={{ fontWeight: 800 }}>Event Information 📝</h2>
                            
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Event Name</label>
                                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle('name')} placeholder="e.g. Electronic Horizon Festival" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Date 📅</label>
                                    <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={inputStyle('date')} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Category 🏷️</label>
                                    <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle('category')}>
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Description 📖</label>
                                <textarea 
                                    value={form.description} 
                                    onChange={e => setForm({...form, description: e.target.value})} 
                                    style={{ ...inputStyle('description'), height: '120px', resize: 'none' }} 
                                    placeholder="Tell people about your event..."
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>City 📍</label>
                                    <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} style={inputStyle('city')} placeholder="Jakarta" />
                                </div>
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Venue 🏟️</label>
                                    <input value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} style={inputStyle('venue')} placeholder="JIEXPO Hall A" />
                                </div>
                            </div>

                            <div>
                                <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Poster Image 🖼️</label>
                                <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} style={inputStyle('file')} />
                            </div>

                            <button onClick={() => validate(1) && setStep(2)} style={{ padding: '16px', background: '#7C3AED', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 800, cursor: 'pointer', fontSize: '16px' }}>Next: Ticket Configuration ➡️</button>
                        </div>
                    )}

                    {/* STEP 2: CONFIG */}
                    {step === 2 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <h2 style={{ fontWeight: 800 }}>Ticket Configuration ⚙️</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Price (ETH) 💎</label>
                                    <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} style={inputStyle('price')} placeholder="0.05" />
                                </div>
                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: 700, display: 'block', marginBottom: '8px' }}>Total Supply 🎫</label>
                                    <input type="number" value={form.maxSupply} onChange={e => setForm({...form, maxSupply: e.target.value})} style={inputStyle('maxSupply')} placeholder="500" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={() => setStep(1)} style={{ flex: 1, padding: '16px', borderRadius: '14px', border: '2px solid #F3F0FF', background: 'none', fontWeight: 700, cursor: 'pointer' }}>Back</button>
                                <button onClick={() => validate(2) && setStep(3)} style={{ flex: 2, padding: '16px', background: '#7C3AED', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 800, cursor: 'pointer' }}>Review Summary ➡️</button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: REVIEW */}
                    {step === 3 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <h2 style={{ fontWeight: 800 }}>Review &amp; Deploy ✅</h2>
                            <div style={{ background: '#FAFAFF', padding: '24px', borderRadius: '18px', border: '1px solid #F3F0FF' }}>
                                <p style={{ marginBottom: '10px' }}>🏁 <b>Event:</b> {form.name}</p>
                                <p style={{ marginBottom: '10px' }}>📅 <b>Date:</b> {form.date}</p>
                                <p style={{ marginBottom: '10px' }}>📖 <b>Description:</b> {form.description}</p>
                                <p style={{ marginBottom: '10px' }}>💎 <b>Price:</b> {form.price} ETH</p>
                                <p>🎫 <b>Supply:</b> {form.maxSupply} Tickets</p>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <button onClick={() => setStep(2)} style={{ flex: 1, padding: '16px', borderRadius: '14px', border: '2px solid #F3F0FF', background: 'none', fontWeight: 700, cursor: 'pointer' }}>Back</button>
                                <button 
                                    onClick={handleSubmit} 
                                    disabled={uploading || isPending}
                                    style={{ flex: 2, padding: '16px', background: '#0F0A1E', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 800, cursor: 'pointer' }}
                                >
                                    {uploading ? 'Uploading to IPFS... ☁️' : isPending ? 'Check Wallet... 🔑' : 'Deploy Smart Contract 🚀'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    )
}