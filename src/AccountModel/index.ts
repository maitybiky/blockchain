import { IWallet } from "../blockchain/Wallet/type";
import accountStore from "../state/accountStore";
import { AccountSet, AccountUpdateArgs, IAccountModel } from "./type";
const { setAccount } = accountStore.getState();

class Account implements IAccountModel {
  private static instance: Account;
  private accounts: AccountSet;
  id: number;
  private constructor() {
    this.accounts = new Map();
    this.id = Math.random();
  }
  static getTheAccount(): Account {
    if (!Account.instance) {
      Account.instance = new Account();
    }
    return Account.instance;
  }
  serializeAccount(data: AccountSet) {
    console.log('data :>> ', data);
    this.accounts = data;
    return Account.instance
  }
  createAccount(wallet: IWallet) {
    const walletId = wallet.getWalletId();
    if (!walletId) return;
    this.accounts.set(walletId, {
      balance: 100,
      nonce: 0,
      metaData: {
        userName: wallet.getUserName(),
      },
    });
    setAccount(this.accounts);
  }
  creditCoin({ walletId, amount }: AccountUpdateArgs): AccountUpdateArgs {
    console.log('this.accounts :>> ', this.accounts);
    const account = this.accounts.get(walletId);
    // if wallet having money for the first time [Welcome Wallet :)  ]
    if (!account) {
      this.accounts.set(walletId, { balance: amount, nonce: 0 });
      return {
        walletId,
        amount,
      };
    }

    let balance = account?.balance + amount;
    let nonce = account?.nonce + 1;

    this.accounts.set(walletId, { ...account, balance, nonce });
    setAccount(this.accounts);

    return {
      walletId,
      amount: balance,
    };
  }
  debitCoin({ walletId, amount }: AccountUpdateArgs): AccountUpdateArgs {
    const account = this.accounts.get(walletId);
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
    this.accounts.set(walletId, { ...account, balance, nonce });
    setAccount(this.accounts);
    return {
      walletId,
      amount: balance,
    };
  }
  getWalletBalance(walletId: string) {
    return this.accounts.get(walletId)?.balance || 0;
  }
  getAllWalletBalance() {
    return this.accounts;
  }
}
export default Account;
