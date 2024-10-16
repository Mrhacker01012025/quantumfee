// app.js
let web3;
let contract;
const contractAddress = "0x291edDd7e0090201a0EbBdf9dD2d40ccA3D40e4F"; // Replace with your deployed contract address
const contractABI =  [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "payer",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "FeePaid",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "payFee",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawFees",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "feesPaid",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
 ];

document.getElementById('connectWalletBtn').onclick = async function () {
    if (typeof window.ethereum !== 'undefined') {
        // Initialize Web3
        web3 = new Web3(window.ethereum);
        await ethereum.request({ method: 'eth_requestAccounts' });

        const accounts = await web3.eth.getAccounts();
        document.getElementById('walletAddress').innerText = `Connected: ${accounts[0]}`;
        document.querySelector('.balance-section').style.display = "block";

        // Initialize contract instance
        contract = new web3.eth.Contract(contractABI, contractAddress);

        // Fetch and display balance
        const balance = await getBalance(accounts[0]);
        document.getElementById('tokenBalance').innerText = `${balance} QFT`;

        document.querySelector('.payment-section').style.display = "block";
        document.getElementById('payFeeBtn').disabled = false;
    } else {
        alert("MetaMask not found. Please install MetaMask.");
    }
};

async function getBalance(account) {
    // Call the balanceOf function from the token contract (ERC20 token)
    const balance = await contract.methods.balanceOf(account).call();
    return web3.utils.fromWei(balance, 'ether'); // Adjust depending on token decimals
}

document.getElementById('payFeeBtn').onclick = async function () {
    const accounts = await web3.eth.getAccounts();
    const feeAmount = web3.utils.toWei('1', 'ether'); // 1 QFT token (replace with actual fee amount)

    try {
        await contract.methods.payFee().send({
            from: accounts[0]
        });
        document.getElementById('paymentStatus').innerText = "Fee paid successfully!";
    } catch (error) {
        document.getElementById('paymentStatus').innerText = `Payment failed: ${error.message}`;
    }
};
