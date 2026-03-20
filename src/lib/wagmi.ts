import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, base } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'TicketPro',
  projectId: 'fe81eb1b17daf3244e518dd16ffe89bc',
  chains: [mainnet, polygon, base],
  ssr: true,
})