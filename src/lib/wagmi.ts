import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'
import { http } from 'wagmi'

export const config = getDefaultConfig({
  appName: 'TicketPro',
  projectId: 'fe81eb1b17daf3244e518dd16ffe89bc',
  chains: [sepolia],
  transports: {
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/7QleYHIyZC-Axa0qwdrRI'),
  },
  ssr: true,
})