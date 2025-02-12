import { IWallet } from "../blockchain/Wallet/type";
import { broadcastAccount } from "../Network/peer/gossips/response/broadcastAccount";
import accountStore from "../state/accountStore";
import { AccountSet, AccountUpdateArgs, IAccountModel } from "./type";
const { setAccount } = accountStore.getState();

class Account implements IAccountModel {
  private static instance: Account;
  private accounts: AccountSet;
  id: number;
  private constructor() {
    this.accounts = {};
    this.id = Math.random();
  }
  static getTheAccount(): Account {
    if (!Account.instance) {
      Account.instance = new Account();
      const persistedAccountData = accountStore.getState().account;
      if (persistedAccountData)
        Account.instance.accounts = persistedAccountData;
    }

    return Account.instance;
  }
  serializeAccount(data: Partial<AccountSet>) {
    Object.assign(this, data);
    setAccount(this.accounts);
  }
  mergeAccount(receivedAccounts: AccountSet) {
    for (const [key, receivedData] of Object.entries(receivedAccounts)) {
      const localData = this.accounts[key];

      if (!localData || receivedData.nonce > localData.nonce) {
        this.accounts[key] = receivedData;
        setAccount(this.accounts);
      }
    }
  }
  createAccount(wallet: IWallet) {
    const walletId = wallet.getWalletId();
    if (!walletId) return;
    this.accounts[walletId] = {
      balance: 100,
      nonce: 0,
      metaData: {
        userName: wallet.getUserName(),
      },
    };
    setAccount(this.accounts);
    broadcastAccount(this.accounts);
  }
  creditCoin({ walletId, amount }: AccountUpdateArgs): AccountUpdateArgs {
    const account = this.accounts[walletId];
    // if wallet having money for the first time [Welcome Wallet :)  ]
    if (!account) {
      this.accounts[walletId] = { balance: amount, nonce: 0 };
      return {
        walletId,
        amount,
      };
    }

    let balance = account?.balance + amount;
    let nonce = account?.nonce + 1;
    this.accounts[walletId] = { ...account, balance, nonce };
    setAccount(this.accounts);

    return {
      walletId,
      amount: balance,
    };
  }
  debitCoin({ walletId, amount }: AccountUpdateArgs): AccountUpdateArgs {
    const account = this.accounts[walletId];
    if (!account) throw new Error("Acount Not Found :" + walletId);
    let balance = account?.balance;
    let nonce = account?.nonce;
    balance -= amount;

    if (balance <= 0) {
      throw new Error("Insufficient balance :" + account.metaData?.userName);
    }
    nonce++;
    console.log("{ ...account, balance, nonce }", {
      ...account,
      balance,
      nonce,
    });
    this.accounts[walletId] = { ...account, balance, nonce };
    setAccount(this.accounts);
    return {
      walletId,
      amount: balance,
    };
  }
  getWalletBalance(walletId: string) {
    console.log("this.accounts :>> ", this.accounts);
    return this.accounts[walletId]?.balance || 0;
  }
  getAllWalletBalance() {
    return this.accounts;
  }
}
export default Account;
