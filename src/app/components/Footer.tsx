'use client'

import Link from 'next/link'

export default function Footer() {
    return (
        <footer style={{ background: '#0F0A1E', color: 'white', padding: '60px 48px 32px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '48px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '18px', marginBottom: '14px' }}>
                            <div style={{ width: '30px', height: '30px', background: 'linear-gradient(135deg,#7C3AED,#EC4899)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>🎟️</div>
                            TicketPro
                        </div>
                        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, maxWidth: '240px' }}>
                            The Web3 NFT ticketing platform for the next generation of live events.
                        </p>

                        {/* SOSIAL MEDIA YUDI */}
                        <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                            <a href="https://instagram.com/yudiant4_" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontSize: '20px' }}>📸</a>
                            <a href="https://x.com/Oxyudiant4_" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontSize: '20px' }}>🐦</a>
                            <a href="https://github.com/yudiant4" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', fontSize: '20px' }}>💻</a>
                            <a href="#" style={{ textDecoration: 'none', fontSize: '20px' }}>👾</a>
                        </div>
                    </div>

                    {[
                        { title: 'Explore', links: ['Marketplace', 'Live Events', 'Upcoming'] },
                        { title: 'Create', links: ['Create Event', 'Dashboard', 'Smart Contracts'] },
                        { title: 'Support', links: ['Help Center', 'Community', 'Contact'] },
                    ].map((col, i) => (
                        <div key={i}>
                            <h4 style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>{col.title}</h4>
                            {col.links.map((l, j) => (
                                <a key={j} href="#" style={{ display: 'block', fontSize: '14px', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', marginBottom: '10px' }}>{l}</a>
                            ))}
                        </div>
                    ))}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>© 2026 TicketPro. All rights reserved. Built with ❤️ by Yudi Anto.</div>
                </div>
            </div>
        </footer>
    )
}