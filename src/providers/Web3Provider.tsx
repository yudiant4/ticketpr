'use client'

import React, { ReactNode } from 'react'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiProvider } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// 1. Inisialisasi QueryClient untuk manajemen data
const queryClient = new QueryClient()

// 2. Project ID dari WalletConnect Cloud (Wajib diisi)
// Dapatkan di: https://cloud.walletconnect.com/
const projectId = 'fe81eb1b17daf3244e518dd16ffe89bc' 

// 3. Konfigurasi Metadata Aplikasi
const metadata = {
  name: 'TicketPro',
  description: 'Web3 NFT Ticketing Ecosystem',
  url: 'https://ticketpr-six.vercel.app/', // Sesuaikan domain kamu
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// 4. Buat Konfigurasi Wagmi
const chains = [sepolia] as const
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  enableEmail: true,    // Mengaktifkan login via Email
  enableSocials: true,   // Mengaktifkan login via Google, X, Discord
  enableAnalytics: true,
})

// 5. Inisialisasi Modal (Pedro Gomes Style)
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  themeVariables: {
    '--w3m-accent': '#7C3AED', // Warna ungu brand TicketPro
    '--w3m-border-radius-master': '2px', // Desain lebih kotak/profesional
  },
  // Menentukan urutan login sosial
  socials: ['google', 'x', 'discord', 'apple'] 
})

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}