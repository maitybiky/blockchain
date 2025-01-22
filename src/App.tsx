import { useEffect, useState } from "react";
import "./App.css";
import { blockchain, main, mempool, processMempool } from "./main";
import networkStore from "./state/store";
import { IBlockchain } from "./blockchain/BlockChain/type";
import { ITransaction } from "./blockchain/Transaction/type";
import connectToNetwork from "./Network/peer/peer";

function App() {
  const { dataChannels, peerConnections, chain: chainData } = networkStore();

  const [chain, setChain] = useState<IBlockchain>(() => {
    return blockchain.serializeChain(chainData);
  });

  const [memPool, setMempool] = useState<ITransaction[]>([]);

  useEffect(() => {
    connectToNetwork();

    main().then(async () => {
      setMempool(mempool.getAllTransactions());
    });
  }, []);

  const startMining = async () => {
    try {
      await processMempool();
      setMempool(mempool.getAllTransactions());
    } catch (error) {
      console.log("MemPool error", error);
    }
  };

  useEffect(() => {
    setChain(blockchain.serializeChain(chainData));
  }, [chainData]);

  useEffect(() => {
    console.log("memPool", memPool);
  }, [memPool]);

  return (
    <>
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
