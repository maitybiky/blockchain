export interface ITransaction {
  // sender: string;
  // receiver: string;
  // amount: number;
  // timestamp: number;
  // signature: Uint8Array | null;
  // hash: string;
  getSender(): string;

  getReceiver(): string;

  getAmount(): number;

  getTimestamp(): number;

  getSignature(): Uint8Array | null;

  getHash(): Promise<string>;

  toString(): string;
  signTransaction(privateKey: string): Promise<ArrayBuffer>;
}
export interface TransactionData {
  sender: string;
  receiver: string;
  amount: number;
  timestamp: number;
  signature: Uint8Array | null;
  hash: string;
}
export type TransactionArgs = {
  sender: string;
  receiver: string;
  amount: number;
  privateKey: string;
};
