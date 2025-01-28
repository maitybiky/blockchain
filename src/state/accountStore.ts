import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { AccountSet } from "../AccountModel/type";

type Store = {
  account: string | null;
  setAccount: (data: AccountSet) => void;
};

const accountStore = create<Store>()(
  devtools(
    persist(
      (set) => ({
        account: null,
        setAccount: (data: AccountSet) => {
          const serializedMap = JSON.stringify(Object.fromEntries(data));
          return set({ account: serializedMap });
        },
      }),
      {
        name: "account-storage",
      }
    )
  )
);

export default accountStore;
