# 💊 Blockchain-Based Medicine Supply Chain System

## 1️⃣ Overview

The Blockchain-Based Medicine Supply Chain System is a decentralized application developed to improve transparency, security, and traceability in the pharmaceutical supply chain. The project uses blockchain technology and smart contracts to track medicine batches from manufacturers to distributors and pharmacies.

The system helps prevent counterfeit medicines by storing all transaction details on the blockchain, making the data tamper-proof and transparent. Each medicine batch can be verified using a QR code, allowing users to check the authenticity and status of medicines.

This project consists of:

* A **Smart Contract** written in Solidity
* A **Backend Server** using Node.js and Express
* A **Frontend Application** using React and Vite
* Blockchain interaction using **Ethers.js**

---

# 2️⃣ Features

### 🔐 Role Management

* Register different participants in the supply chain:

  * Manufacturer
  * Distributor
  * Pharmacy

### 📦 Batch Creation

* Manufacturers can create medicine batches.
* Each batch stores:

  * Batch ID
  * Medicine name
  * Expiry date
  * Manufacturer details
  * Current owner
  * Timestamp
  * Batch status

### 🔄 Batch Transfer

* Medicine batches can be transferred securely:

  * Manufacturer → Distributor
  * Distributor → Pharmacy

### 🏥 Delivery Confirmation

* Pharmacies can confirm delivery of medicine batches.

### 🔍 Product Verification

* Users can verify medicine authenticity using batch details.

### 📱 QR Code Generation

* QR codes are generated for medicine batches.
* Scanning the QR code redirects users to batch verification details.

### ⛓️ Blockchain Security

* All supply chain transactions are stored on blockchain.
* Data cannot be modified once recorded.

---

# 3️⃣ Technologies Used

## Frontend

* React.js
* Vite
* React Router DOM
* Axios
* HTML5
* CSS3
* JavaScript

## Backend

* Node.js
* Express.js
* CORS
* QRCode Package

## Blockchain

* Solidity
* Ethereum Blockchain
* Ganache
* Truffle
* Ethers.js
* MetaMask

---

# 4️⃣ How It Works

## Step 1: User Registration

Participants in the supply chain are registered with specific roles such as Manufacturer, Distributor, or Pharmacy.

## Step 2: Batch Creation

The Manufacturer creates a medicine batch by entering medicine details and expiry information.

## Step 3: Blockchain Storage

The smart contract stores the batch information securely on the blockchain.

## Step 4: Transfer of Ownership

The batch is transferred:

* Manufacturer → Distributor
* Distributor → Pharmacy

Ownership details are updated on the blockchain.

## Step 5: Delivery Confirmation

The Pharmacy confirms the delivery of the medicine batch.

## Step 6: QR Verification

A QR code is generated for the batch.
Users can scan the QR code to verify:

* Product authenticity
* Current owner
* Batch status
* Expiry details

---

# 5️⃣ How to Run the Project

## 📌 Prerequisites

Make sure the following software is installed:

* Node.js
* npm
* Ganache
* MetaMask
* Truffle

---

## 📂 Clone the Repository

```bash
git clone <repository-link>
cd blockchain-assignment
```

---

## ⚙️ Install Dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

### Smart Contract

```bash
cd smart-contract
npm install
```

---

## 🚀 Start Ganache

1. Open Ganache
2. Start a local blockchain workspace
3. Copy the RPC URL
   Example:

```bash
http://127.0.0.1:7545
```

---

## 🔨 Deploy Smart Contract

Move to the smart-contract folder:

```bash
truffle migrate --reset
```

After deployment:

* Copy the deployed contract address
* Update the contract address in:

  * `backend/server.js`
  * `frontend/src/contract.js`

---

## ▶️ Run Backend Server

```bash
cd backend
node server.js
```

Server runs on:

```bash
http://localhost:5000
```

---

## ▶️ Run Frontend Application

```bash
cd frontend
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

## 🦊 Connect MetaMask

1. Install MetaMask browser extension
2. Connect MetaMask to Ganache network
3. Import Ganache account using private key
4. Connect wallet in the application

---

# 📌 Conclusion

The Blockchain-Based Medicine Supply Chain System provides a secure and transparent solution for tracking medicines throughout the supply chain. By integrating blockchain technology, smart contracts, and QR verification, the project ensures authenticity, prevents counterfeit products, and improves trust among manufacturers, distributors, pharmacies, and consumers.
