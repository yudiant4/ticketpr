import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
  console.log('🚀 Deploying TicketNFT to Sepolia...')

  const [deployer] = await ethers.getSigners()
  console.log('Deploying with account:', deployer.address)
  
  const balance = await ethers.provider.getBalance(deployer.address)
  console.log('Account balance:', ethers.formatEther(balance), 'ETH')

  const TicketNFT = await ethers.getContractFactory('TicketNFT')
  const ticketNFT = await TicketNFT.deploy()
  await ticketNFT.waitForDeployment()

  const address = await ticketNFT.getAddress()
  console.log('✅ TicketNFT deployed to:', address)
  console.log('🔗 View on Etherscan: https://sepolia.etherscan.io/address/' + address)
  
  // Create sample event
  console.log('\n📅 Creating sample event...')
  const tx = await ticketNFT.createEvent(
    'Electronic Horizon Festival',
    '28 Mar 2026',
    'JIEXPO Hall A, Jakarta',
    ethers.parseEther('0.01'),
    1000,
    500,
    "ipfs://QmContohCidDummy123" 
  )
  await tx.wait()
  console.log('✅ Sample event created!')
  console.log('\n📋 Save this contract address:', address)
};

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
