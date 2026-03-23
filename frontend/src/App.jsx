import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

// 🌈 GLOBAL STYLES
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "20px",
    background: "#f5f7fa",
    minHeight: "100vh"
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    margin: "20px auto"
  },
  input: {
    display: "block",
    width: "90%",
    padding: "10px",
    margin: "10px auto",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px 20px",
    background: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px"
  },
  nav: {
    marginBottom: "20px"
  },
  link: {
    margin: "0 10px",
    textDecoration: "none",
    color: "#333",
    fontWeight: "bold"
  }
};

// =====================
// 🏭 MANUFACTURER
// =====================
function Manufacturer() {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [qr, setQr] = useState("");

  const createBatch = async () => {
    const res = await axios.post("http://localhost:5000/createBatch", {
      id,
      name
    });

    setQr(res.data.qrCode);
    alert("Batch Created!");
  };

  return (
    <div style={styles.card}>
      <h2>🏭 Manufacturer</h2>

      <input style={styles.input} placeholder="Batch ID" onChange={(e) => setId(e.target.value)} />
      <input style={styles.input} placeholder="Medicine Name" onChange={(e) => setName(e.target.value)} />

      <button style={styles.button} onClick={createBatch}>Create Batch</button>

      {qr && <img src={qr} alt="QR" style={{ marginTop: "15px" }} />}
    </div>
  );
}

// =====================
// 🚚 DISTRIBUTOR
// =====================
function Distributor() {
  const [id, setId] = useState("");
  const [address, setAddress] = useState("");

  const transfer = async () => {
    try{
    console.log("Transfer button clicked");

    await axios.post("http://localhost:5000/transferBatch", {
      id,
      to: address,
      status: "In Transit"
    });
    console.log(res.data);
    alert("Transferred!");
  } catch (err) {
    console.error(err);
    alert("Transfer failed");
  }
  };

  return (
    <div style={styles.card}>
      <h2>🚚 Distributor</h2>

      <input style={styles.input} placeholder="Batch ID" onChange={(e) => setId(e.target.value)} />
      <input style={styles.input} placeholder="Pharmacy Address" onChange={(e) => setAddress(e.target.value)} />

      <button style={styles.button} onClick={transfer}>Transfer</button>
    </div>
  );
}

// =====================
// 🏥 PHARMACY
// =====================
function Pharmacy() {
  const [id, setId] = useState("");

  const deliver = async () => {
    await axios.post("http://localhost:5000/transferBatch", {
      id,
      to: "Pharmacy",
      status: "Delivered"
    });

    alert("Delivered!");
  };

  return (
    <div style={styles.card}>
      <h2>🏥 Pharmacy</h2>

      <input style={styles.input} placeholder="Batch ID" onChange={(e) => setId(e.target.value)} />

      <button style={styles.button} onClick={deliver}>Mark Delivered</button>
    </div>
  );
}

// =====================
// 🔍 VERIFY
// =====================
function Verify() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/verify/${id}`)
      .then(res => setData(res.data))
      .catch(() => alert("Invalid Product"));
  }, [id]);

  if (!data) return <p>Loading...</p>;

  return (
    <div style={styles.card}>
      <h2>🔍 Verification</h2>

      <p><b>ID:</b> {data.id}</p>
      <p><b>Name:</b> {data.name}</p>
      <p><b>Status:</b> {data.status}</p>
      <p><b>Owner:</b> {data.currentOwner}</p>
    </div>
  );
}

// =====================
// 🌐 MAIN APP
// =====================
export default function App() {
  return (
    <div style={styles.container}>
      <h1>💊 Medicine Supply Chain</h1>

      <div style={styles.nav}>
        <Link style={styles.link} to="/">Manufacturer</Link>
        <Link style={styles.link} to="/distributor">Distributor</Link>
        <Link style={styles.link} to="/pharmacy">Pharmacy</Link>
      </div>

      <Routes>
        <Route path="/" element={<Manufacturer />} />
        <Route path="/distributor" element={<Distributor />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/verify/:id" element={<Verify />} />
      </Routes>
    </div>
  );
}