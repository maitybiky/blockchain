import Account from "../AccountModel";
import { AccountSet } from "../AccountModel/type";
import accountStore from "./accountStore";

export const serializeClasses = () => {
  const persistedAccountData = accountStore.getState().account;
  console.log("persistedAccountData :>> ", persistedAccountData);
  if (persistedAccountData) {
    const deserializedMap = new Map(
      Object.entries(JSON.parse(persistedAccountData))
    ) as AccountSet;

    Account.getTheAccount().serializeAccount(deserializedMap);
  }
};
