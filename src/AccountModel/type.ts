import { IWallet } from "../blockchain/Wallet/type";

export interface IAccountModel {
  id: number;
  // accounts: Map<string, aData>; //private
  createAccount(wallet: IWallet): any;
  getWalletBalance(walletId: string): number;
  getAllWalletBalance(): AccountSet;
  mergeAccount(remoteAccount: AccountSet): void;
  creditCoin({ walletId, amount }: AccountUpdateArgs): AccountUpdateArgs;
  debitCoin({ walletId, amount }: AccountUpdateArgs): AccountUpdateArgs;
}
export type AccountSet = Record<string, aData>;

export type aData = {
  balance: number;
  nonce: number;
  metaData?: any;
};

export interface AccountUpdateArgs {
  walletId: string;
  amount: number;
}
