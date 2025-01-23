import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { IBlockchain } from "../blockchain/BlockChain/type";
import { ITransaction } from "../blockchain/Transaction/type";
type Store = {
  chain: IBlockchain;
  updateChain: (chain: IBlockchain) => void;
  mempool: Map<string, ITransaction>;
};

const blockChainStore = create<Store>()(
  devtools((set) => ({
    updateChain: (chain: IBlockchain) => set(() => ({ chain })),
  }))
);

export default blockChainStore;
