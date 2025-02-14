import React, { useState } from "react";
import "./index.css";
import Wallet from "../../../blockchain/Wallet";
import walletStore from "../../../state/wallet";
import { IWallet } from "../../../blockchain/Wallet/type";
import { getWallets } from "../../../state/getter";
import WalletCard from "../Card/WalletCard";
import Transaction from "../../../blockchain/Transaction";
import { broadcastTransaction } from "../../../Network/peer/gossips/request/broadCastTransaction";

const CreateWallet: React.FC<{ closePage: () => void }> = ({ closePage }) => {
  const { setWallet } = walletStore();
  const [wallets, setWallets] = useState<IWallet[]>(getWallets());
  const [userName, setUserName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [sender, setSender] = useState("");
  const [reciver, setReciver] = useState("");
  // Handle wallet creation
  const handleCreateWallet = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const newWallet = new Wallet(userName); // Create Wallet instance
      await newWallet.active(); // Activate wallet (generate keys, ID, etc.)

      setWallet(newWallet); // Set wallet in state
      setWallets(getWallets());
    } catch (err: unknown) {
      console.log("err :>> ", err);
      setError((err as Error).message || "Failed to create wallet");
    } finally {
      setIsLoading(false);
    }
  };
  const sendTransaction = async () => {
    try {
      if (!reciver) return alert("define reciver");
      const sender = wallets[0];
      // const reciver = wallets[2].getPublicKey();

      const createTransactionRequest = new Transaction({
        amount: 20,
        privateKey: sender.getPrivateKey(),
        receiver: reciver,
        sender: sender.getPublicKey(),
      });
      console.log("createTransactionRequest :>> ", createTransactionRequest);
      await createTransactionRequest.signTransaction(sender.getPrivateKey());
      broadcastTransaction(createTransactionRequest);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <button onClick={closePage}>home</button>
      <h1>Create a Wallet</h1>
      <>
        <div>
          <label htmlFor="userName">Enter Username:</label>
          <input
            id="userName"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your username"
            style={{
              padding: "0.5rem",
              margin: "0.5rem 0",
              width: "100%",
              fontSize: "1rem",
            }}
          />
        </div>
        <button
          onClick={handleCreateWallet}
          disabled={!userName || isLoading}
          style={{
            padding: "0.5rem 1rem",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          {isLoading ? "Creating Wallet..." : "Create Wallet"}
        </button>
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
      </>

      <h1>send money</h1>

      <h4>reciver</h4>
      <input value={reciver} onChange={(e) => setReciver(e.target.value)} />
      <button onClick={sendTransaction}>send 20</button>
      {wallets.map((wallet) => {
        return <WalletCard wallet={wallet} />;
      })}
    </div>
  );
};

export default CreateWallet;
