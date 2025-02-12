import Account from "../AccountModel";
import accountStore from "./accountStore";

export const serializeClasses = () => {
  const persistedAccountData = accountStore.getState().account;
  console.log("persistedAccountData :>> ", persistedAccountData);
  if (persistedAccountData) {
    Account.getTheAccount().serializeAccount(persistedAccountData);
  }
};
