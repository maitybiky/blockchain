import { useEffect, useState } from "react";
import "./App.css";
import { main, mempool, processMempool } from "./main";
// import networkStore from "./state/networkstore";
import { IBlockchain } from "./blockchain/BlockChain/type";
import { ITransaction } from "./blockchain/Transaction/type";
import connectToNetwork from "./Network/peer/connection/peer";
import Blockchain from "./blockchain/BlockChain";
import Mempool from "./blockchain/Mempool";
import CreateWallet from "./pages/CreateWallet/Index";

function App() {
  const [walletPage, setWalletPage] = useState(false);
  const [chain, setChain] = useState<IBlockchain>(() => {
    return Blockchain.getBlockChain();
  });

  const [memPool, setMempool] = useState<ITransaction[]>([]);

  useEffect(() => {
    connectToNetwork();

    main().then(async () => {
      setMempool(Mempool.getTheMemPool().getAllTransactions());
    });
  }, []);

  const startMining = async () => {
    try {
      await processMempool();
      setChain(Blockchain.getBlockChain());
      setMempool(mempool.getAllTransactions());
    } catch (error) {
      console.log("MemPool error", error);
    }
  };

  useEffect(() => {
    console.log("memPool", memPool);
  }, [memPool]);

  // jsx

  if (walletPage) {
    return <CreateWallet />;
  }
  return (
    <>
      <h1>
        <button onClick={() => setWalletPage(true)}>Wallet</button>
      </h1>
      <h1>Mem Pool</h1>
      <div className="mempool_container">
        {memPool.map((transaction) => {
          return <button>{transaction.getAmount()}</button>;
        })}
      </div>

      <button onClick={startMining}>start mining</button>
      {chain.getChain().map((block) => {
        return <button>{block.hash?.slice(0, 9)}...</button>;
      })}
    </>
  );
}

export default App;
