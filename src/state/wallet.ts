import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { IWallet } from "../blockchain/Wallet/type";

type Store = {
  myWallets: Record<string, IWallet>; // Wallet can be null initially
  setWallet: (wallet: IWallet) => void;
  clearWallet: () => void; // To clear the wallet from storage
};

const walletStore = create<Store>()(
  devtools(
    persist(
      (set) => ({
        myWallets: {}, // Default value for yourWallet
        setWallet: (wallet: IWallet) =>
          set((state) => {
            if (
              !wallet.getPrivateKey() ||
              !wallet.getPublicKey() ||
              !wallet.getWalletId() ||
              !wallet.getUserName()
            ) {
              throw new Error("Wallet is not active!");
            }
            const walletId = wallet.getWalletId();
            const prevWallets = state.myWallets;
            if (walletId) {
              prevWallets[walletId] = wallet;
            }
            return { myWallets: prevWallets };
          }),
        clearWallet: () => set(() => ({ myWallets: {} })),
      }),
      {
        name: "wallet-storage", // Key for localStorage
        partialize: (state) => ({ myWallets: state.myWallets }), // Save only the `yourWallet` field
      }
    )
  )
);

export default walletStore;
