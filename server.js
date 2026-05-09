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
const privateKey = "0xb2c23ca858151db8d81f71b3829397085e7e1e492306e4051f18988d4fdeb896";
const wallet = new ethers.Wallet(privateKey, provider);
const contractAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";
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
        const { name } = req.body;

        const tx = await contract.createBatch(name);
        await tx.wait();

        res.send("Batch created");
    } catch (err) {
        res.status(500).send(err);
    }
});
app.get("/verifyBatch/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const data = await contract.getBatch(id);
        res.json({
            id: data[0].toString(),
            name: data[1],
            manufacturer: data[2],
            currentOwner: data[3],
            timestamp: data[4].toString(),
            status: data[5]
        });
    } catch (err) {
        res.status(500).send(err);
    }
});