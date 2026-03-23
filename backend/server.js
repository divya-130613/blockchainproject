console.log("Using contract:",0x16F94db21993E443499eD9e055c3bD7382Bdc259 );
console.log("Backend wallet:", wallet.address);
const express = require("express");
const cors = require("cors");
const QRCode = require("qrcode");
const app = express();
app.use(express.json());
app.use(cors());
app.listen(5000, () => {
    console.log("Server running on port 5000");
});
app.post("/generateQR", async (req, res) => {
    try {
        const { batchId } = req.body;
        const url = `http://localhost:3000/verify/${batchId}`;
        const qr = await QRCode.toDataURL(url);
        res.json({ qr });
    } catch (err) {
        res.status(500).send(err);
    }
});
const { ethers } = require("ethers");
app.use(express.json());
app.use(cors());
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
const privateKey = "0xfec2eb978370f2b9cee5514396b58f884478bc7412c54e61fb054fb4ab651049";
const wallet = new ethers.Wallet(privateKey, provider);
const contractAddress = "0x2Cc44d7f61bA2810dAa8284A0cFb633fa464c617";
const abi = [
    {
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			}
		],
		"name": "BatchCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "to",
				"type": "address"
			}
		],
		"name": "BatchTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			}
		],
		"name": "createBatch",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			},
			{
				"internalType": "enum MedicineSupplyChain.Role",
				"name": "_role",
				"type": "uint8"
			}
		],
		"name": "registerRole",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_to",
				"type": "address"
			}
		],
		"name": "transferBatch",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "batchCount",
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
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "batches",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "manufacturer",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "currentOwner",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "status",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getBatch",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "roles",
		"outputs": [
			{
				"internalType": "enum MedicineSupplyChain.Role",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
const contract = new ethers.Contract(contractAddress, abi, wallet);
app.post("/generateQR", async (req, res) => {
    try {
        const { batchId } = req.body;
        const url = `http://localhost:3000/verify/${batchId}`;
        const qr = await QRCode.toDataURL(url);
        res.json({ qr });
    } catch (err) {
        res.status(500).send(err);
    }
});
app.post("/createBatch", async (req, res) => {
    try {

	    console.log("CreateBatch API hit"); 

        const { name } = req.body;

        const tx = await contract.createBatch(name);
        await tx.wait();
        
		console.log("Batch created successfully");
        res.send("Batch created");
    } catch (err) {
		console.error("ERROR:", err); 

        res.status(500).send(err);
    }
});
const transferBatch = async () => {
	try {
	  console.log("Transfer button clicked"); // 👈 ADD THIS
  
	  const res = await axios.post("http://localhost:5000/transferBatch", {
		id,
		to
	  });
  
	  console.log(res.data);
	  alert("Batch transferred!");
  
	} catch (err) {
	  console.error(err);
	  alert("Transfer failed");
	}
  };
app.get("/verify/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const batch = await contract.batches(id);
        res.json({
            id: batch[0].toString(),
            name: batch[1],
            manufacturer: batch[2],
            currentOwner: batch[3],
            timestamp: batch[4].toString(),
            status: batch[5]
        });
    } catch (err) {
		console.error("VERIFY ERROR:", err);
		res.status(500).send("Invalid Product");
    }
});