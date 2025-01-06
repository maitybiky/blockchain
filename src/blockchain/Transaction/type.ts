export interface ITransaction {
  sender: string;
  receiver: string;
  amount: number;
  timestamp: number;
  signature: Uint8Array | null;
  hash: string;
  toString(): string;
  signTransaction(privateKey: string): Promise<ArrayBuffer>;
}
export type TransactionArgs = {
  sender: string;
  receiver: string;
  amount: number;
  privateKey: string;
};
