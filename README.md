Medicine Supply Chain using Blockchain

1️⃣ Overview

This project implements a blockchain-based medicine supply chain system that ensures transparency, security, and traceability of medicines from manufacturer to customer.
Each transaction is recorded on the blockchain, preventing tampering and enabling users to verify the authenticity of medicines using QR codes.

2️⃣ Features

✔ Role-based access control (Manufacturer, Distributor, Pharmacy)
✔ Secure batch creation on blockchain
✔ Transfer tracking between supply chain entities
✔ Real-time status updates (Created → In Transit → Delivered)
✔ QR code generation for each batch
✔ Customer verification system
✔ Tamper-proof and transparent records
✔ Event logging for tracking transactions

3️⃣ Technologies Used

🔹 Frontend
React.js
Axios
CSS
🔹 Backend
Node.js
Express.js
Ethers.js
🔹 Blockchain
Solidity (Smart Contract)
Ethereum (local blockchain using Ganache)
🔹 Tools
Remix IDE (for deployment)
Ganache (local blockchain network)
MetaMask (optional wallet integration)

4️⃣ How It Works

The system follows a 4-step supply chain flow:

Manufacturer → Distributor → Pharmacy → Customer
🏭 Step 1: Manufacturer
Creates a medicine batch
Batch is stored on blockchain
QR code is generated
🚚 Step 2: Distributor
Receives batch
Transfers it further
Status changes to In Transit
🏥 Step 3: Pharmacy
Receives batch from distributor
Marks it as delivered
Status becomes Delivered
👤 Step 4: Customer
Scans QR code
Verifies medicine details
Ensures authenticity

👉 All these steps are recorded on blockchain, making the system secure and transparent.

5️⃣ How to Run the Project

🔹 Step 1: Start Ganache
Open Ganache
Copy RPC URL (e.g., http://127.0.0.1:7545)
🔹 Step 2: Deploy Smart Contract
Open Remix IDE
Compile MedicineSupplyChain.sol
Deploy using Web3 Provider (Ganache)
Copy contract address
🔹 Step 3: Update Backend
Paste contract address in server.js
Add ABI file
Add Ganache private key
🔹 Step 4: Run Backend
cd backend
npm install
node server.js
🔹 Step 5: Run Frontend
cd frontend
npm install
npm run dev
🔹 Step 6: Access Application
http://localhost:5173
🔹 Step 7: Test Flow
Create batch (Manufacturer)
Transfer batch (Distributor)
Deliver batch (Pharmacy)
Verify product (Customer)
🎯 Conclusion

This system demonstrates how blockchain can be used to build a secure, transparent, and tamper-proof medicine supply chain, ensuring trust and authenticity for end users.
