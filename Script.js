let signer;
let userAddress;
const contractAddress = "0x28305b55E88A1696d02F9d31d0f4b0a6e84A5285"; // Your FireNFT contract
const contractABI = [
  {
    "inputs": [],
    "name": "mintWithEth",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

async function connectWallet() {
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer = await provider.getSigner();
    userAddress = await signer.getAddress();
    document.getElementById("walletAddress").innerText = "Connected: " + userAddress;
  } else {
    alert("Please install MetaMask!");
  }
}

async function mintNFT() {
  if (!signer) {
    alert("Connect wallet first!");
    return;
  }
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  try {
    const tx = await contract.mintWithEth({ value: ethers.parseEther("0.000111") });
    await tx.wait();
    alert("NFT Minted Successfully!");
  } catch (error) {
    console.error(error);
    alert("Mint Failed!");
  }
}

async function burnNFT() {
  if (!signer) {
    alert("Connect wallet first!");
    return;
  }

  const nftContractAddress = document.getElementById("nftContract").value;
  const tokenId = document.getElementById("tokenId").value;

  if (!nftContractAddress || !tokenId) {
    alert("Please fill both fields!");
    return;
  }

  const nftABI = [
    "function safeTransferFrom(address from, address to, uint256 tokenId)"
  ];

  const nftContract = new ethers.Contract(nftContractAddress, nftABI, signer);
  try {
    const tx = await nftContract.safeTransferFrom(userAddress, contractAddress, tokenId);
    await tx.wait();
    alert("NFT Burned and FireNFT Minted!");
  } catch (error) {
    console.error(error);
    alert("Burn Failed!");
  }
}
