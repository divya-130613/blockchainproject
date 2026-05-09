import { useEffect, useState } from "react";
import { Link, Route, Routes, useParams } from "react-router-dom";
import {
  CONTRACT_ADDRESS,
  connectWallet,
  formatContractError,
  getConnectedWallet,
  getContract,
  hasMetaMask,
  normalizeAddress,
} from "./contract";

const APP_URL = "http://localhost:5173";

const styles = {
  container: {
    fontFamily: "Segoe UI, sans-serif",
    textAlign: "center",
    padding: "20px",
    background: "#f5f7fa",
    minHeight: "100vh",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    maxWidth: "520px",
    margin: "20px auto",
  },
  input: {
    display: "block",
    width: "90%",
    padding: "10px",
    margin: "10px auto",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 20px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
  },
  secondaryButton: {
    padding: "10px 20px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "10px",
    marginLeft: "10px",
  },
  nav: {
    marginBottom: "20px",
  },
  link: {
    margin: "0 10px",
    textDecoration: "none",
    color: "#333",
    fontWeight: "bold",
  },
  warning: {
    background: "#fff3cd",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #ffc107",
    textAlign: "left",
  },
  info: {
    background: "#dbeafe",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "20px",
    border: "1px solid #93c5fd",
    textAlign: "left",
  },
  code: {
    display: "block",
    wordBreak: "break-all",
    background: "#f3f4f6",
    padding: "10px",
    borderRadius: "8px",
    marginTop: "8px",
  },
};

function shortAddress(address) {
  if (!address) return "Not connected";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function roleLabel(role) {
  switch (Number(role)) {
    case 1:
      return "Manufacturer";
    case 2:
      return "Distributor";
    case 3:
      return "Pharmacy";
    default:
      return "Unregistered";
  }
}

function WalletBanner({ walletAddress, refreshWallet }) {
  const [status, setStatus] = useState("");

  const handleConnect = async () => {
    try {
      setStatus("");
      await connectWallet();
      await refreshWallet();
    } catch (error) {
      setStatus(formatContractError(error));
    }
  };

  return (
    <div style={{ ...styles.card, maxWidth: "720px" }}>
      <h2>Wallet</h2>
      <p>
        <b>Connected account:</b> {shortAddress(walletAddress)}
      </p>
      <p>
        <b>Contract:</b> <code>{CONTRACT_ADDRESS}</code>
      </p>
      <button style={styles.button} onClick={handleConnect}>
        Connect MetaMask
      </button>
      {status && <p>{status}</p>}
    </div>
  );
}

function SetupRoles({ walletAddress }) {
  const [user, setUser] = useState(walletAddress || "");
  const [role, setRole] = useState("1");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (walletAddress) {
      setUser(walletAddress);
    }
  }, [walletAddress]);

  const registerRole = async () => {
    try {
      if (!user) {
        setMessage("Enter a wallet address first.");
        return;
      }

      setLoading(true);
      setMessage("Waiting for MetaMask confirmation...");

      const { contract } = await getContract({ requireSigner: true });
      const normalizedUser = normalizeAddress(user);
      const tx = await contract.registerRole(normalizedUser, Number(role));
      await tx.wait();

      setMessage("Role registered successfully.");
    } catch (error) {
      setMessage(`Failed: ${formatContractError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2>Setup Roles</h2>

      <div style={styles.warning}>
        <p>
          Register each wallet directly on-chain from MetaMask before using the
          Manufacturer, Distributor, or Pharmacy pages.
        </p>
      </div>

      <label style={{ display: "block", textAlign: "left", fontWeight: "bold" }}>
        Wallet Address
      </label>
      <input
        style={styles.input}
        placeholder="0x..."
        value={user}
        onChange={(event) => setUser(event.target.value)}
      />

      <label style={{ display: "block", textAlign: "left", fontWeight: "bold" }}>
        Role
      </label>
      <select
        style={{ ...styles.input, cursor: "pointer" }}
        value={role}
        onChange={(event) => setRole(event.target.value)}
      >
        <option value="1">Manufacturer</option>
        <option value="2">Distributor</option>
        <option value="3">Pharmacy</option>
      </select>

      <button style={styles.button} onClick={registerRole} disabled={loading}>
        {loading ? "Submitting..." : "Register Role"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

function Manufacturer() {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [message, setMessage] = useState("");
  const [batchId, setBatchId] = useState("");
  const [loading, setLoading] = useState(false);

  const createBatch = async () => {
    try {
      if (!name || !expiry) {
        setMessage("Enter medicine name and expiry date.");
        return;
      }

      setLoading(true);
      setMessage("Waiting for MetaMask confirmation...");

      const expiryTimestamp = Math.floor(new Date(expiry).getTime() / 1000);
      const { contract } = await getContract({ requireSigner: true });
      const tx = await contract.createBatch(name, expiryTimestamp);
      await tx.wait();

      const latestBatchId = await contract.batchCount();
      const nextBatchId = latestBatchId.toString();

      setBatchId(nextBatchId);
      setMessage("Batch created successfully.");
    } catch (error) {
      setMessage(`Failed: ${formatContractError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2>Manufacturer</h2>

      <input
        style={styles.input}
        placeholder="Medicine Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <input
        style={styles.input}
        type="date"
        value={expiry}
        onChange={(event) => setExpiry(event.target.value)}
      />

      <button style={styles.button} onClick={createBatch} disabled={loading}>
        {loading ? "Submitting..." : "Create Batch"}
      </button>

      {message && <p>{message}</p>}
      {batchId && (
        <div style={styles.info}>
          <p>
            <b>Batch ID:</b> {batchId}
          </p>
          <p>
            <b>Verify URL:</b>
          </p>
          <code style={styles.code}>{`${APP_URL}/verify/${batchId}`}</code>
        </div>
      )}
    </div>
  );
}

function TransferBatch({ walletAddress }) {
  const [id, setId] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletRole, setWalletRole] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadRole() {
      try {
        if (!walletAddress) {
          setWalletRole("");
          return;
        }

        const { contract } = await getContract();
        const role = await contract.roles(walletAddress);

        if (!cancelled) {
          setWalletRole(roleLabel(role));
        }
      } catch {
        if (!cancelled) {
          setWalletRole("");
        }
      }
    }

    loadRole();

    return () => {
      cancelled = true;
    };
  }, [walletAddress]);

  const transfer = async () => {
    try {
      if (!id || !address) {
        setMessage("Enter a batch ID and recipient wallet.");
        return;
      }

      setLoading(true);
      setMessage("Waiting for MetaMask confirmation...");

      const { contract } = await getContract({ requireSigner: true });
      const normalizedAddress = normalizeAddress(address);
      const tx = await contract.transferBatch(id, normalizedAddress);
      await tx.wait();

      setMessage("Batch transferred successfully.");
    } catch (error) {
      setMessage(`Transfer failed: ${formatContractError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2>Transfer Batch</h2>
      <div style={styles.info}>
        <p>
          This page is used for both transfers:
          <br />
          Manufacturer -&gt; Distributor
          <br />
          Distributor -&gt; Pharmacy
        </p>
        <p>
          <b>Connected wallet:</b> {shortAddress(walletAddress)}
        </p>
        <p>
          <b>Detected role:</b> {walletRole || "Unknown"}
        </p>
      </div>

      <input
        style={styles.input}
        placeholder="Batch ID"
        value={id}
        onChange={(event) => setId(event.target.value)}
      />
      <input
        style={styles.input}
        placeholder="Pharmacy Address"
        value={address}
        onChange={(event) => setAddress(event.target.value)}
      />

      <button style={styles.button} onClick={transfer} disabled={loading}>
        {loading ? "Submitting..." : "Transfer"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

function Pharmacy() {
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [batchOwner, setBatchOwner] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadWallet() {
      try {
        const wallet = await getConnectedWallet();
        if (!cancelled) {
          setWalletAddress(wallet.address);
        }
      } catch {
        if (!cancelled) {
          setWalletAddress("");
        }
      }
    }

    loadWallet();

    return () => {
      cancelled = true;
    };
  }, []);

  const deliver = async () => {
    try {
      if (!id) {
        setMessage("Enter a batch ID.");
        return;
      }

      setLoading(true);
      setMessage("Waiting for MetaMask confirmation...");

      const preview = await getContract();
      const batch = await preview.contract.getBatch(id);
      const owner = batch[4];
      setBatchOwner(owner);

      if (walletAddress && owner.toLowerCase() !== walletAddress.toLowerCase()) {
        setMessage(
          `This batch is currently owned by ${owner}. Switch to that wallet before marking it delivered.`
        );
        setLoading(false);
        return;
      }

      const { contract } = await getContract({ requireSigner: true });
      const tx = await contract.deliverBatch(id);
      await tx.wait();

      setMessage("Batch marked as delivered.");
    } catch (error) {
      setMessage(`Delivery failed: ${formatContractError(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h2>Pharmacy</h2>
      <div style={styles.info}>
        <p>Use this only after the batch has already been transferred to the Pharmacy wallet.</p>
        <p>
          <b>Connected wallet:</b> {shortAddress(walletAddress)}
        </p>
        {batchOwner && (
          <p>
            <b>Current batch owner:</b> {shortAddress(batchOwner)}
          </p>
        )}
      </div>

      <input
        style={styles.input}
        placeholder="Batch ID"
        value={id}
        onChange={(event) => setId(event.target.value)}
      />

      <button style={styles.button} onClick={deliver} disabled={loading}>
        {loading ? "Submitting..." : "Mark Delivered"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
}

function Verify() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadBatch() {
      try {
        setError("");
        setData(null);

        const { contract } = await getContract();
        const batch = await contract.getBatch(id);

        if (cancelled) {
          return;
        }

        if (batch[0] === 0n) {
          setError("Invalid product");
          return;
        }

        setData({
          id: batch[0].toString(),
          name: batch[1],
          expiry: batch[2].toString(),
          manufacturer: batch[3],
          currentOwner: batch[4],
          timestamp: batch[5].toString(),
          status: batch[6],
        });
      } catch (loadError) {
        if (!cancelled) {
          setError(formatContractError(loadError));
        }
      }
    }

    loadBatch();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (error) {
    return (
      <div style={styles.card}>
        <h2>Verification Failed</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={styles.card}>
        <p>Loading batch from blockchain...</p>
      </div>
    );
  }

  const isExpired = Number(data.expiry) * 1000 < Date.now();

  return (
    <div style={styles.card}>
      <h2>Verification</h2>

      <p>
        <b>ID:</b> {data.id}
      </p>
      <p>
        <b>Name:</b> {data.name}
      </p>
      <p>
        <b>Expiry:</b> {new Date(Number(data.expiry) * 1000).toLocaleDateString()}
      </p>
      <p>
        <b>Status:</b> {data.status}
      </p>
      <p>
        <b>Manufacturer:</b> {data.manufacturer}
      </p>
      <p>
        <b>Current Owner:</b> {data.currentOwner}
      </p>
      {isExpired && (
        <p style={{ color: "red" }}>
          <b>Expired</b>
        </p>
      )}
    </div>
  );
}

export default function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletError, setWalletError] = useState("");

  const refreshWallet = async () => {
    try {
      if (!hasMetaMask()) {
        setWalletError("MetaMask is not installed in this browser.");
        setWalletAddress("");
        return;
      }

      const wallet = await getConnectedWallet();
      setWalletAddress(wallet.address);
      setWalletError("");
    } catch (error) {
      setWalletError(formatContractError(error));
    }
  };

  useEffect(() => {
    refreshWallet();

    if (!window.ethereum?.on) {
      return undefined;
    }

    const handleAccountsChanged = (accounts) => {
      setWalletAddress(accounts[0] || "");
    };

    const handleChainChanged = () => {
      refreshWallet();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (!window.ethereum?.removeListener) {
        return;
      }

      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1>Medicine Supply Chain</h1>
      <p>This version talks to your smart contract directly through MetaMask.</p>

      <WalletBanner walletAddress={walletAddress} refreshWallet={refreshWallet} />
      {walletError && <p>{walletError}</p>}

      <div style={styles.nav}>
        <Link style={styles.link} to="/setup">
          Setup
        </Link>
        <Link style={styles.link} to="/">
          Manufacturer
        </Link>
        <Link style={styles.link} to="/distributor">
          Transfer
        </Link>
        <Link style={styles.link} to="/pharmacy">
          Pharmacy
        </Link>
      </div>

      <Routes>
        <Route path="/setup" element={<SetupRoles walletAddress={walletAddress} />} />
        <Route path="/" element={<Manufacturer />} />
        <Route path="/distributor" element={<TransferBatch walletAddress={walletAddress} />} />
        <Route path="/pharmacy" element={<Pharmacy />} />
        <Route path="/verify/:id" element={<Verify />} />
      </Routes>
    </div>
  );
}
