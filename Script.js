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

async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask not detected.");
    return;
  }

  try {
    // Request wallet connection
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    // Create provider and signer
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    userAddress = account;

    // Display wallet address
    document.getElementById("walletAddress").innerText = "Connected: " + userAddress;
  } catch (error) {
    console.error(error);
    alert("Connection failed: " + error.message);
  }
}

async function mintNFT() {
  if (!signer) {
    alert("Please connect your wallet first.");
    return;
  }

  try {
    const contract = new ethers.Contract(fireNFTContract, fireNFTABI, signer);
    const tx = await contract.mintWithEth({
      value: ethers.parseEther("0.000111")
    });
    await tx.wait();
    alert("NFT Minted Successfully!");
  } catch (error) {
    console.error(error);
    alert("Mint failed: " + error.message);
  }
}
