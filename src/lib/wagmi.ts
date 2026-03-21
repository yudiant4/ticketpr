// 1. Ini adalah baris IMPORT untuk mengenalkan fungsinya
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';
import { http } from 'wagmi';

// 2. Ini adalah konfigurasi utamanya
export const config = getDefaultConfig({
  appName: 'ticketPr',
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'fe81eb1b17daf3244e518dd16ffe89bc',
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(
      process.env.NEXT_PUBLIC_ALCHEMY_URL || '7QleYHIyZC-Axa0qwdrRI'
      'https://eth-sepolia.g.alchemy.com/v2/7QlEyjH0...' // Pastikan ini link utuhnya ya kalau mau di-hardcode
    ),
  },
  ssr: true,
});