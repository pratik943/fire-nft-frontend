let signer;
let userAddress;
let provider; // dynamic provider (MetaMask OR WalletConnect)

const fireNFTContract = "0x28305b55E88A1696d02F9d31d0f4b0a6e84A5285"; // Your contract address
const fireNFTABI = [
  {
    "inputs": [],
    "name": "mintWithEth",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

// WalletConnect Project ID (you can generate your own free at walletconnect.com)
const wcProjectId = "ca6d2183aa46019ee53d7c3a1fce4f58"; // Using public demo projectId

async function connectWallet() {
  try {
    if (window.ethereum) {
      // Ask user if they want MetaMask or WalletConnect
      const useWalletConnect = confirm("Click OK for WalletConnect, Cancel for MetaMask");

      if (useWalletConnect) {
        const walletConnectProvider = new window.WalletConnectProvider.default({
          projectId: wcProjectId,
          chains: [8453], // Base mainnet chain ID
          methods: ["eth_sendTransaction", "eth_signTransaction", "personal_sign", "eth_signTypedData"]
        });

        await walletConnectProvider.enable();
        provider = new ethers.BrowserProvider(walletConnectProvider);
      } else {
        provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
      }

      signer = await provider.getSigner();
      userAddress = await signer.getAddress();
      document.getElementById("walletAddress").innerText = "Connected: " + userAddress;
    } else {
      alert("No wallet detected! Install MetaMask or use WalletConnect compatible wallet.");
    }
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
