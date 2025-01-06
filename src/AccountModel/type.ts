export interface IAccountModel {
  // accounts: Map<string, aData>; //private
  getWalletBalance(walletId: string): number;
  getAllWalletBalance(walletId: string): AccountSet;
  creditCoin({ walletId, amount }: AccountUpdateArgs): AccountUpdateArgs;
  debitCoin({ walletId, amount }: AccountUpdateArgs): AccountUpdateArgs;
}
export type AccountSet = Map<string, { balance: number; nonce: number }>;

export type aData = {
  balance: number;
  nonce: number;
};
export interface AccountUpdateArgs {
  walletId: string;
  amount: number;
}
