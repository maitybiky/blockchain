import { ITransaction } from "../Transaction/type";

export type RKeyPair = {
  privateKey: string;
  publicKey: string;
};
export interface IWallet {
  getUserName(): string;
  getWalletId(): string | null;
  getPrivateKey(): string;
  getPublicKey(): string;
  getTransactions(): ITransaction[];
  createKeyValuePair(): Promise<RKeyPair>;
  active(): Promise<void>;
}
