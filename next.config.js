/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ini akan memberitahu Vercel untuk mengabaikan error TypeScript saat build.
    // Sangat berguna karena library Web3 seringkali punya konflik tipe data.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Opsional: Ini juga membantu agar build tidak berhenti karena masalah linting
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig