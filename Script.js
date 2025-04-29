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
    alert("MetaMask is not installed.");
    return;
  }

  try {
    // Request account access
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Switch to Base mainnet (chainId: 0x2105)
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x2105" }] // Base chain ID in hex
    });

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    userAddress = await signer.getAddress();

    document.getElementById("walletAddress").innerText = "Connected: " + userAddress;
  } catch (error) {
    console.error(error);
    alert("Connection failed: " + error.message);
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
