import Account from "../../../../AccountModel";
import { AccountSet } from "../../../../AccountModel/type";

export const onAccountRecieve = (account: AccountSet) => {
  console.log("account rec :>> ", account);
  Account.getTheAccount().mergeAccount(account);
  console.log("synced accounts", Account.getTheAccount().getAllWalletBalance());
};
