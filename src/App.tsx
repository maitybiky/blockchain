import { useEffect, useState } from "react";
import "./App.css";
import { main, processMempool } from "./main";
// import networkStore from "./state/networkstore";
import { IBlockchain } from "./blockchain/BlockChain/type";
import { TransactionData } from "./blockchain/Transaction/type";
import connectToNetwork from "./Network/peer/connection/peer";
import Blockchain from "./blockchain/BlockChain";
import Mempool from "./blockchain/Mempool";
import CreateWallet from "./Component/Wallet/CreateWallet/Index";
import accountStore from "./state/accountStore";
import NavBar from "./Component/NavigationBar/NavBar";
import mempoolStore from "./state/memPoolStore";
import { getSeriaLizedMemPool } from "./state/getter";

function App() {
  const [walletPage, setWalletPage] = useState(false);
  const [chain, setChain] = useState<IBlockchain>(() => {
    return Blockchain.getBlockChain();
  });

  const [memPoolState, setMempoolState] = useState<TransactionData[]>([]);
  const { memPool } = mempoolStore();
  const acc = accountStore().account;
  useEffect(() => {
    connectToNetwork();

    main().then(async () => {
      setMempoolState(Mempool.getTheMemPool().getAllTransactions());
    });
  }, []);

  const startMining = async () => {
    try {
      await processMempool();
      setChain(Blockchain.getBlockChain());
      setMempoolState(Mempool.getTheMemPool().getAllTransactions());
    } catch (error) {
      console.log("MemPool error", error);
    }
  };

  useEffect(() => {
    // serialize mempool from the zustand then get all transaction then store to local state
    const thePool=getSeriaLizedMemPool()
    setMempoolState(thePool.getAllTransactions());

  }, [memPool, acc]);

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
        {memPoolState.map((transaction) => {
          return <button>{transaction.amount}</button>;
        })}
      </div>

      <button onClick={startMining}>start mining</button>
      {chain.getChain().map((block) => {
        return <button>{block.hash?.slice(0, 9)}...</button>;
      })}
      <NavBar />
    </>
  );
}

export default App;
