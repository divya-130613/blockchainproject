import { ethers } from "ethers";
import abi from "../../smart-contract/ABI.json";

export const CONTRACT_ADDRESS = "0x918759e80ae35b820B1FC908F3F421AD02F86652";

export function hasMetaMask() {
  return typeof window !== "undefined" && typeof window.ethereum !== "undefined";
}

export async function connectWallet() {
  if (!hasMetaMask()) {
    throw new Error("MetaMask is not installed.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return { provider, signer, address };
}

export async function getConnectedWallet() {
  if (!hasMetaMask()) {
    throw new Error("MetaMask is not installed.");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_accounts", []);

  if (!accounts.length) {
    return { provider, signer: null, address: "" };
  }

  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  return { provider, signer, address };
}

export async function getContract({ requireSigner = false } = {}) {
  const wallet = requireSigner ? await connectWallet() : await getConnectedWallet();
  const provider = wallet.provider;
  const signer = wallet.signer;
  const runner = signer ?? provider;
  const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, runner);

  return { ...wallet, contract };
}

export function formatContractError(error) {
  if (error?.argument === "target") {
    return "Invalid wallet address.";
  }

  return (
    error?.reason ||
    error?.shortMessage ||
    error?.info?.error?.message ||
    error?.message ||
    "Transaction failed."
  );
}

export function normalizeAddress(value) {
  return ethers.getAddress(String(value).trim());
}
