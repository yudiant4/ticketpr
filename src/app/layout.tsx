import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { Web3Provider } from '@/providers/Web3Provider'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
})

export const metadata: Metadata = {
  title: 'TicketPro — NFT Ticketing',
  description: 'Buy, sell, and collect verified event tickets on the blockchain.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${jakarta.variable} font-jakarta antialiased`}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}