import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { IMempool } from "../blockchain/Mempool/type";
import Mempool from "../blockchain/Mempool";

type Store = {
  memPool: IMempool | null;
  updateMemPool: (data: IMempool) => void;
};

const mempoolStore = create<Store>()(
  devtools(
    persist(
      (set) => ({
        memPool: null, // Initialize with an empty object
        updateMemPool: (data: IMempool) => set(() => ({ memPool: data })),
      }),
      {
        name: "mempool-storage",
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.memPool = Mempool.getTheMemPool(); // Initialize after hydration
          }
        },
      }
    )
  )
);

export default mempoolStore;
