const express = require("express");
const cors = require("cors");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");
const { ethers } = require("ethers");

const app = express();
app.use(express.json());
app.use(cors());

const provider = new ethers.JsonRpcProvider("http://127.0.0.1:7545");
const privateKey = "0x348ef2ce55c97aea238721f86fd628d06a8ac0c43d31d37f46e9b8092d44b439";
const wallet = new ethers.Wallet(privateKey, provider);
const contractAddress = "0x918759e80ae35b820B1FC908F3F421AD02F86652";

const abiPath = path.join(__dirname, "../smart-contract/ABI.json");
const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));

const contract = new ethers.Contract(contractAddress, abi, wallet);

console.log("Using contract:", contractAddress);
console.log("Backend wallet:", wallet.address);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});

// Register Role
app.post("/registerRole", async (req, res) => {
    try {
        const { user, role } = req.body;
        const tx = await contract.registerRole(user, role);
        await tx.wait();
        res.send("Role registered");
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// Create Batch
app.post("/createBatch", async (req, res) => {
    try {
        const { name, expiry } = req.body;
        const tx = await contract.createBatch(name, expiry);
        await tx.wait();
        const batchCount = await contract.batchCount();
        res.json({ batchId: batchCount.toString() });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// Transfer Batch
app.post("/transferBatch", async (req, res) => {
    try {
        const { id, to } = req.body;
        const tx = await contract.transferBatch(id, to);
        await tx.wait();
        res.send("Batch transferred");
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// Deliver Batch
app.post("/deliverBatch", async (req, res) => {
    try {
        const { id } = req.body;
        const tx = await contract.deliverBatch(id);
        await tx.wait();
        res.send("Batch delivered");
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
});

// Generate QR
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

// Verify Batch
app.get("/verify/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const batch = await contract.getBatch(id);
        if (batch[0] == 0) {
            return res.status(404).send("Invalid Product");
        }
        res.json({
            id: batch[0].toString(),
            name: batch[1],
            expiry: batch[2].toString(),
            manufacturer: batch[3],
            currentOwner: batch[4],
            timestamp: batch[5].toString(),
            status: batch[6]
        });
    } catch (err) {
        console.error("VERIFY ERROR:", err);
        res.status(500).send("Invalid Product");
    }
});
