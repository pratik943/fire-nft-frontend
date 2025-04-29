let signer;
let provider;
let userAddress;

const fireNFTContract = "0x28305b55E88A1696d02F9d31d0f4b0a6e84A5285";
const fireNFTABI = [
  {
    "inputs": [],
    "name": "mintWithEth",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

// ✅ FIX: Use Web3ModalStandalone to match standalone.umd.js
const modal = window.Web3ModalStandalone.initStandalone({
  projectId: "ca6d2183aa46019ee53d7c3a1fce4f58", // You can replace with your own later
  chains: [
    {
      id: 8453,
      name: "Base",
      rpcUrls: ["https://mainnet.base.org"],
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18
      }
    }
  ]
});

async function connectWallet() {
  try {
    await modal.openModal(); // ✅ Show WalletConnect popup
    const session = await modal.connect();

    provider = new ethers.BrowserProvider(session.provider);
    signer = await provider.getSigner();
    userAddress = await signer.getAddress();

    document.getElementById("walletAddress").innerText = "Connected: " + userAddress;
  } catch (err) {
    console.error(err);
    alert("Wallet connection failed.");
  }
}

async function mintNFT() {
  if (!signer) {
    alert("Connect wallet first!");
    return;
  }

  const contract = new ethers.Contract(fireNFTContract, fireNFTABI, signer);

  try {
    const tx = await contract.mintWithEth({ value: ethers.parseEther("0.000111") });
    await tx.wait();
    alert("NFT Minted Successfully!");
  } catch (error) {
    console.error(error);
    alert("Mint Failed!");
  }
}
