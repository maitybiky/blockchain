import { AccountSet, AccountUpdateArgs, IAccountModel } from "./type";

class Account implements IAccountModel {
  private static instance: Account;

  private accounts: AccountSet;
  constructor() {
    this.accounts = new Map();
  }
  creditCoin({ walletId, amount }: AccountUpdateArgs): AccountUpdateArgs {
    const account = this.accounts.get(walletId);

    // if wallet having money for the first time [Welcome Wallet :)  ]
    if (!account) {
      this.accounts.set(walletId, { balance: amount, nonce: 0 });
      return {
        walletId,
        amount,
      };
    }

    let balance = account?.balance;
    let nonce = account?.nonce;
    this.accounts.set(walletId, { balance, nonce });
    return {
      walletId,
      amount: balance,
    };
  }
  debitCoin({ walletId, amount }: AccountUpdateArgs): AccountUpdateArgs {
    console.log("account.get :>> ", this.accounts);
    const account = this.accounts.get(walletId);
    if (!account) throw new Error("Acount Not Found :" + walletId);
    let balance = account?.balance;
    let nonce = account?.nonce;
    balance -= amount;
    if (balance <= 0) {
      throw new Error("Insufficient balance");
    }
    nonce++;
    this.accounts.set(walletId, { balance, nonce });

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
