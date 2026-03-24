'use client'

// Wajib agar build Vercel lancar
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { useCreateEvent } from '@/hooks/useTicketPro'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function CreateEventPage() {
    // PENGAMAN 1: State Mounted untuk cegah Hydration Error
    const [mounted, setMounted] = useState(false);
    const { isConnected } = useAccount()
    const { createEvent, isPending, isConfirming } = useCreateEvent()
    const [isMobile, setIsMobile] = useState(false)
    const [step, setStep] = useState(1)

    const [form, setForm] = useState({
        name: '',
        date: '',
        venue: '',
        city: '',
        category: 'Music 🎵',
        description: '', 
        price: '',
        maxSupply: '',
        royalty: '500', 
    })
    
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const categories = ['Music 🎵', 'Art 🎨', 'Tech 💻', 'Sports 🏟️', 'Theater 🎭', 'Web3 🌐', 'Gaming 🎮']

    // PENGAMAN 2: Jalankan useEffect untuk handle mounting & resize
    useEffect(() => {
        setMounted(true); // Tandai bahwa komponen sudah di-load di browser
        const handleResize = () => setIsMobile(window.innerWidth < 768)
        handleResize(); window.addEventListener('resize', handleResize)
        
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            window.removeEventListener('resize', handleResize);
        }
    }, [previewUrl])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const validate = (currentStep: number) => {
        const newErrors: Record<string, string> = {}
        if (currentStep === 1) {
            if (!form.name) newErrors.name = 'Required';
            if (!form.date) newErrors.date = 'Required';
            if (!form.description) newErrors.description = 'Required';
            if (!form.city) newErrors.city = 'Required';
            if (!file) newErrors.file = 'Poster Required 🖼️';
        } else if (currentStep === 2) {
            if (!form.price || parseFloat(form.price) <= 0) newErrors.price = 'Invalid';
            if (!form.maxSupply || parseInt(form.maxSupply) <= 0) newErrors.maxSupply = 'Invalid';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async () => {
        if (!validate(2)) return;
        if (!file) return;
        
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/pinata", { method: "POST", body: formData });
            const data = await res.json();
            
            // Safety check untuk IPFS Hash
            if (!data.ipfsHash) throw new Error("Pinata upload failed");

            await createEvent(
                form.name,
                form.date,
                `${form.venue}, ${form.city}`,
                parseEther(form.price || '0'),
                BigInt(form.maxSupply || '0'),
                BigInt(form.royalty || '500'),
                `ipfs://${data.ipfsHash}`
            );
        } catch (err) {
            console.error(err);
            alert("Error: Check console for details 🌐");
        } finally { setUploading(false); }
    };

    const inputStyle = (field: string) => ({
        width: '100%', padding: '14px 16px',
        border: `2px solid ${errors[field] ? '#EF4444' : '#F3F0FF'}`,
        borderRadius: '14px', fontSize: '15px', outline: 'none', background: 'white',
        fontFamily: 'inherit'
    })

    // JANGAN RENDER APAPUN SEBELUM MOUNTED (Cegah Client-Side Exception)
    if (!mounted) return null;

    if (!isConnected) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '20px', textAlign: 'center' }}>
                <h2 style={{ fontWeight: 800, marginBottom: '20px' }}>Please connect wallet 🔑</h2>
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
                </div>
            </div>

            <div style={{ maxWidth: '850px', margin: '-40px auto 100px', padding: '0 20px' }}>
                <div style={{ background: 'white', padding: isMobile ? '24px' : '40px', borderRadius: '32px', border: '1px solid #E8E4F5' }}>
                    
                    {step === 1 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <h2 style={{ fontWeight: 800 }}>Event Info 📝</h2>
                            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle('name')} placeholder="Event Name" />
                            
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                                <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={inputStyle('date')} />
                                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={inputStyle('category')}>
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} style={{ ...inputStyle('description'), height: '120px', resize: 'none' }} placeholder="Description..." />

                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px' }}>
                                <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} style={inputStyle('city')} placeholder="Surabaya" />
                                <input value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} style={inputStyle('venue')} placeholder="Grand City" />
                            </div>

                            <input type="file" accept="image/*" onChange={handleFileChange} style={inputStyle('file')} />
                            {previewUrl && <img src={previewUrl} alt="Preview" style={{ maxHeight: '150px', borderRadius: '12px', objectFit: 'contain' }} />}

                            <button onClick={() => validate(1) && setStep(2)} style={{ padding: '16px', background: '#7C3AED', color: 'white', borderRadius: '14px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Next ➡️</button>
                        </div>
                    )}

                    {step === 2 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <h2 style={{ fontWeight: 800 }}>Pricing ⚙️</h2>
                            <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} style={inputStyle('price')} placeholder="Price in ETH" />
                            <input type="number" value={form.maxSupply} onChange={e => setForm({...form, maxSupply: e.target.value})} style={inputStyle('maxSupply')} placeholder="Total Tickets" />
                            <button onClick={() => validate(2) && setStep(3)} style={{ padding: '16px', background: '#7C3AED', color: 'white', borderRadius: '14px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Review ➡️</button>
                        </div>
                    )}

                    {step === 3 && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <h2 style={{ fontWeight: 800 }}>Deploy ✅</h2>
                            <div style={{ background: '#FAFAFF', padding: '20px', borderRadius: '16px' }}>
                                <p>🏁 {form.name} | 💎 {form.price} ETH | 🎫 {form.maxSupply} Qty</p>
                            </div>
                            <button onClick={handleSubmit} disabled={uploading || isPending} style={{ padding: '16px', background: '#0F0A1E', color: 'white', borderRadius: '14px', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                                {uploading ? 'Uploading... ☁️' : isPending ? 'Confirming... 🔑' : 'Create Event 🚀'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    )
}