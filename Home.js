import { useState } from "react";
import axios from "axios";

function Home() {
  const [name, setName] = useState("");
  const [batchId, setBatchId] = useState("");
  const [qr, setQr] = useState("");

  // Create Batch
  const createBatch = async () => {
    try {
      await axios.post("http://localhost:5000/createBatch", { name });
      alert("Batch created successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  // Generate QR
  const generateQR = async () => {
    try {
      const res = await axios.post("http://localhost:5000/generateQR", {
        batchId,
      });
      setQr(res.data.qr);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Create Batch</h2>
      <input
        placeholder="Medicine Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={createBatch}>Create</button>

      <h2>Generate QR</h2>
      <input
        placeholder="Batch ID"
        value={batchId}
        onChange={(e) => setBatchId(e.target.value)}
      />
      <button onClick={generateQR}>Generate</button>

      {qr && <img src={qr} alt="QR Code" />}
    </div>
  );
}

export default Home;