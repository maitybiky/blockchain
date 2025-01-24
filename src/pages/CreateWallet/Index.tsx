import React, { useState } from "react";
import "./index.css";
import Wallet from "../../blockchain/Wallet";
import walletStore from "../../state/wallet";
import { IWallet } from "../../blockchain/Wallet/type";
import { getWallets } from "../../state/getter";
import WalletCard from "../../blockchain/Wallet/WalletCard";
import { account } from "../../main";

const CreateWallet: React.FC = () => {
  const { setWallet } = walletStore();
  const [wallets, setWallets] = useState<IWallet[]>(getWallets());
  const [userName, setUserName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Handle wallet creation
  const handleCreateWallet = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const newWallet = new Wallet(userName); // Create Wallet instance
      console.log("newWallet :>> ", newWallet);
      await newWallet.active(); // Activate wallet (generate keys, ID, etc.)

      setWallet(newWallet); // Set wallet in state
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to create wallet");
    } finally {
      setIsLoading(false);
    }
  };
  console.log("wallets :>> ", wallets);
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
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
      {wallets.map((wallet) => {
        const walletId = wallet.getWalletId();
        if (!walletId) return;
        const balance = account.getWalletBalance(walletId);
        const userName = wallet.getUserName();
        const walletAddress = wallet.getWalletId();

        if (Number.isInteger(balance) && userName && walletAddress)
          return (
            <WalletCard
              userName={userName}
              balance={balance}
              walletAddress={walletAddress}
            />
          );
      })}
    </div>
  );
};

export default CreateWallet;
