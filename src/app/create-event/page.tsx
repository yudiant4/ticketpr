'use client'

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { useCreateEvent } from '@/hooks/useTicketPro'
import Navbar from '../components/Navbar'


export default function CreateEventPage() {
    const [mounted, setMounted] = useState(false);
    const { isConnected } = useAccount()
    const { createEvent, isPending } = useCreateEvent()
    const [step, setStep] = useState(1)
    const [uploading, setUploading] = useState(false)

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

    useEffect(() => { setMounted(true) }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async () => {
        if (!file || !form.price || !form.maxSupply) {
            alert("Please fill all data!");
            return;
        }
        
        setUploading(true);
        console.log("1. Starting upload to Pinata...");

        try {
            const formData = new FormData();
            formData.append("file", file);
            
            const res = await fetch("/api/pinata", { method: "POST", body: formData });
            const data = await res.json();
            
            if (!data.ipfsHash) {
                console.error("Pinata Error:", data);
                throw new Error("Gagal upload gambar ke Pinata. Cek Environment Variables di Vercel!");
            }

            console.log("2. Image uploaded! Hash:", data.ipfsHash);
            console.log("3. Sending transaction to MetaMask...");

            // PERBAIKAN: Pastikan semua parameter BigInt dikirim dengan benar
            await createEvent(
                form.name,
                form.date,
                `${form.venue}, ${form.city}`,
                parseEther(form.price), 
                BigInt(form.maxSupply),
                BigInt(form.royalty),
                `ipfs://${data.ipfsHash}`
            );

        } catch (err: any) {
            console.error("Error Detail:", err);
            alert(`Gagal: ${err.message || "Cek Console (F12)"}`);
        } finally { 
            setUploading(false); 
        }
    };

    if (!mounted) return null;

    return (
        <main style={{ background: '#FAFAFF', minHeight: '100vh', padding: '100px 20px' }}>
            <Navbar />
            <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '32px', border: '1px solid #E8E4F5', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{ flex: 1, height: '4px', background: step >= i ? '#7C3AED' : '#E8E4F5', borderRadius: '10px' }} />
                    ))}
                </div>

                {step === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h2 style={{ fontWeight: 800 }}>Event Info 📝</h2>
                        <input placeholder="Event Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E8E4F5' }} />
                        <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E8E4F5' }} />
                        <input placeholder="Location (Venue)" value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E8E4F5' }} />
                        <div style={{ border: '2px dashed #E8E4F5', padding: '20px', borderRadius: '16px', textAlign: 'center' }}>
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                            {previewUrl && <img src={previewUrl} style={{ width: '100%', marginTop: '10px', borderRadius: '8px' }} />}
                        </div>
                        <button onClick={() => setStep(2)} disabled={!form.name || !file} style={{ padding: '16px', background: '#7C3AED', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Next: Pricing ➡️</button>
                    </div>
                )}

                {step === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <h2 style={{ fontWeight: 800 }}>Pricing & Supply ⚙️</h2>
                        <input type="number" placeholder="Price (ETH)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E8E4F5' }} />
                        <input type="number" placeholder="Total Supply (e.g. 100)" value={form.maxSupply} onChange={e => setForm({...form, maxSupply: e.target.value})} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E8E4F5' }} />
                        <button onClick={() => setStep(3)} style={{ padding: '16px', background: '#7C3AED', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>Next: Review ➡️</button>
                        <button onClick={() => setStep(1)} style={{ color: '#9896B0', background: 'none', border: 'none', cursor: 'pointer' }}>Back</button>
                    </div>
                )}

                {step === 3 && (
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{ fontWeight: 800, marginBottom: '20px' }}>Final Review ✅</h2>
                        <div style={{ background: '#FAFAFF', padding: '20px', borderRadius: '16px', textAlign: 'left', marginBottom: '24px' }}>
                            <p><b>Event:</b> {form.name}</p>
                            <p><b>Price:</b> {form.price} ETH</p>
                            <p><b>Supply:</b> {form.maxSupply} Tickets</p>
                        </div>
                        <button onClick={handleSubmit} disabled={uploading || isPending} style={{ width: '100%', padding: '16px', background: '#0F0A1E', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, cursor: 'pointer' }}>
                            {uploading ? 'Uploading to IPFS... ☁️' : isPending ? 'Check MetaMask... 🔑' : 'Confirm & Deploy Event 🚀'}
                        </button>
                        <button onClick={() => setStep(2)} style={{ color: '#9896B0', background: 'none', border: 'none', cursor: 'pointer', marginTop: '16px' }}>Back to edit</button>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    )
}