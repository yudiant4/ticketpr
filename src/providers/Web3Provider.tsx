'use client'

import React, { ReactNode } from 'react'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiProvider } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

// Gunakan Project ID kamu dari cloud.walletconnect.com
const projectId = 'fe81eb1b17daf3244e518dd16ffe89bc' 

const metadata = {
  name: 'TicketPro',
  description: 'Web3 NFT Ticketing Ecosystem',
  url: process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'https://ticketpr-six.vercel.app/',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const chains = [sepolia] as const

// PERBAIKAN: Hapus enableEmail dan enableSocials dari sini
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
})

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  // Hapus enableOnramp yang ada di sini (di luar)
  features: {
    email: true,
    socials: ['google', 'x', 'discord', 'apple'],
    onramp: true // Cukup aktifkan di dalam sini
  },
  themeVariables: {
    '--w3m-accent': '#7C3AED',
    '--w3m-border-radius-master': '2px',
  }
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