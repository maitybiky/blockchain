import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { BlockChainObj, IBlockchain } from "../blockchain/BlockChain/type";
type Store = {
  chain: BlockChainObj | null;
  updateChain: (chain: IBlockchain) => void;
  // mempool: Map<string, ITransaction>;
};

const blockChainStore = create<Store>()(
  devtools(
    persist(
      (set) => ({
        chain: null,
        updateChain: (chain: IBlockchain) => {
          console.log('chain in store :>> ', chain);
          const chainObject: BlockChainObj = {
            chain: chain.getChain(),
            difficulty: chain.getDifficulty(),
            nonce: chain.getNonce(),
          };
          return set(() => ({ chain: chainObject }));
        },
      }),
      {
        name: "blockchain-store",
      }
    )
  )
);

export default blockChainStore;
