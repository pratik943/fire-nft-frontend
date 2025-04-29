let provider;
let signer;
let userAddress;

const contractAddress = "0x28305b55E88A1696d02F9d31d0f4b0a6e84A5285";
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
    try {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      userAddress = await signer.getAddress();

      document.getElementById("walletAddress").innerText =
        "Connected: " + userAddress.slice(0, 6) + "..." + userAddress.slice(-4);
      document.getElementById("mintBtn").disabled = false;

      alert("Wallet Connected Successfully!");
    } catch (err) {
      console.error(err);
      alert("Connection failed!");
    }
  } else {
    alert("MetaMask not detected!");
  }
}

async function mintNFT() {
  if (!signer) {
    alert("Please connect your wallet first!");
    return;
  }

  try {
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    const tx = await contract.mintWithEth({
      value: ethers.utils.parseEther("0.000111")
    });
    alert("Transaction sent!\nTX Hash: " + tx.hash);
    window.open(`https://basescan.org/tx/${tx.hash}`, "_blank");
  } catch (error) {
    console.error(error);
    alert("Mint failed!");
  }
}

window.onload = () => {
  document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
  document.getElementById("mintBtn").addEventListener("click", mintNFT);
};
