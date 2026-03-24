'use client'

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { useCreateEvent } from '@/hooks/useTicketPro'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

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
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        setMounted(true);
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const validate = (currentStep: number) => {
        const newErrors: Record<string, string> = {}
        if (currentStep === 1) {
            if (!form.name) newErrors.name = 'Required';
            if (!file) newErrors.file = 'Poster Required';
        } else if (currentStep === 2) {
            if (!form.price || parseFloat(form.price) <= 0) newErrors.price = 'Invalid';
            if (!form.maxSupply || parseInt(form.maxSupply) <= 0) newErrors.maxSupply = 'Invalid';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const handleSubmit = async () => {
        if (!validate(2) || !file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await fetch("/api/pinata", { method: "POST", body: formData });
            const data = await res.json();

            if (!data.ipfsHash) throw new Error("Upload failed");

            // PERBAIKAN: Gunakan parseEther untuk harga
            await createEvent(
                form.name,
                form.date,
                `${form.venue}, ${form.city}`,
                parseEther(form.price || '0'),
                BigInt(form.maxSupply || '0'),
                BigInt(form.royalty || '500'),
                `ipfs://${data.ipfsHash}`
            );
            alert("Event Created Successfully! 🚀");
        } catch (err) {
            console.error(err);
            alert("Error: Check console 🌐");
        } finally { setUploading(false); }
    };

    if (!mounted) return null;

    return (
        <main style={{ background: '#FAFAFF', minHeight: '100vh', padding: '100px 20px' }}>
            <Navbar />
            <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '24px', border: '1px solid #E8E4F5' }}>
                <h1 style={{ fontWeight: 800, marginBottom: '24px' }}>Step {step}: Create Event</h1>

                {step === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <input placeholder="Event Name" onChange={e => setForm({ ...form, name: e.target.value })} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E8E4F5' }} />
                        <textarea placeholder="Description" onChange={e => setForm({ ...form, description: e.target.value })} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E8E4F5', height: '100px' }} />
                        <input type="file" onChange={handleFileChange} />
                        <button onClick={() => validate(1) && setStep(2)} style={{ padding: '16px', background: '#7C3AED', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700 }}>Next</button>
                    </div>
                )}

                {step === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <input type="number" placeholder="Price (ETH)" onChange={e => setForm({ ...form, price: e.target.value })} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E8E4F5' }} />
                        <input type="number" placeholder="Max Tickets" onChange={e => setForm({ ...form, maxSupply: e.target.value })} style={{ padding: '14px', borderRadius: '12px', border: '1px solid #E8E4F5' }} />
                        <button onClick={() => validate(2) && setStep(3)} style={{ padding: '16px', background: '#7C3AED', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700 }}>Review</button>
                    </div>
                )}

                {step === 3 && (
                    <div style={{ textAlign: 'center' }}>
                        <p>Deploy <b>{form.name}</b> for <b>{form.price} ETH</b>?</p>
                        <button onClick={handleSubmit} disabled={uploading || isPending} style={{ width: '100%', padding: '16px', background: '#0F0A1E', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, marginTop: '20px' }}>
                            {uploading ? 'Uploading...' : isPending ? 'Check MetaMask...' : 'Confirm & Create 🚀'}
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    )
}