let signer;
let provider;
let userAddress;
let web3Modal;

const fireNFTContract = "0x28305b55E88A1696d02F9d31d0f4b0a6e84A5285"; // your contract
const fireNFTABI = [
  {
    "inputs": [],
    "name": "mintWithEth",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

// WalletConnect Provider options
const providerOptions = {
  walletconnect: {
    package: window.WalletConnectProvider.default,
    options: {
      rpc: {
        8453: "https://mainnet.base.org" // Base Mainnet RPC
      },
      chainId: 8453
    }
  }
};

// Initialize Web3Modal
window.addEventListener('load', async () => {
  web3Modal = new window.Web3Modal.default({
    cacheProvider: false,
    providerOptions
  });
});

async function connectWallet() {
  try {
    const instance = await web3Modal.connect();
    provider = new ethers.BrowserProvider(instance);
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
