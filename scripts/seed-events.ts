import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  console.log('🌱 Seeding events to contract...')

  const [deployer] = await ethers.getSigners()
  const contract = await ethers.getContractAt(
    'TicketNFT',
    '0x83c8533bBEB920ccd51d3297BBC4d3b5219D0Cb7'
  )

  const events = [
    {
      name: 'Electronic Horizon Festival',
      date: '28 Mar 2026',
      venue: 'JIEXPO Hall A, Jakarta',
      price: '0.01',
      maxSupply: 1000,
      royalty: 500,
    },
    {
      name: 'Neon City Rave Vol. 3',
      date: '5 Apr 2026',
      venue: 'Potato Head, Bali',
      price: '0.008',
      maxSupply: 800,
      royalty: 500,
    },
    {
      name: 'Block Summit 2026',
      date: '12 Apr 2026',
      venue: 'Grand City Hall, Surabaya',
      price: '0.005',
      maxSupply: 2000,
      royalty: 300,
    },
    {
      name: 'Metamorphosis Art Fair',
      date: '19 Apr 2026',
      venue: 'Gedung Sate, Bandung',
      price: '0.007',
      maxSupply: 600,
      royalty: 500,
    },
    {
      name: 'Web3 Culture Festival',
      date: '25 Apr 2026',
      venue: 'Prambanan Area, Yogyakarta',
      price: '0.006',
      maxSupply: 1500,
      royalty: 400,
    },
    {
      name: 'DeFi Launchpad Night',
      date: '2 Mei 2026',
      venue: 'The Westin, Jakarta',
      price: '0.005',
      maxSupply: 500,
      royalty: 300,
    },
  ]

  // Cek event count dulu
  const currentCount = await contract.eventCount()
  console.log('Current event count:', currentCount.toString())

  // Mulai dari event 2 (event 1 sudah ada)
  const startFrom = Number(currentCount)

  for (let i = startFrom; i < events.length; i++) {
    const ev = events[i]
    console.log(`\n📅 Creating event ${i + 1}: ${ev.name}`)

    const tx = await contract.createEvent(
      ev.name,
      ev.date,
      ev.venue,
      ethers.parseEther(ev.price),
      BigInt(ev.maxSupply),
      BigInt(ev.royalty)
    )
    await tx.wait()
    console.log(`✅ Event ${i + 1} created!`)
  }

  const finalCount = await contract.eventCount()
  console.log('\n🎉 Done! Total events:', finalCount.toString())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
