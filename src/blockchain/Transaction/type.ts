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

  getSignature(): string | null;

  getHash(): Promise<string>;

  toString(): string;
  signTransaction(privateKey: string): Promise<string>;
}
export interface TransactionData {
  sender: string;
  receiver: string;
  amount: number;
  timestamp: number;
  signature: string | null;
  hash: string;
}
export interface TransactionSignaturePayload {
  amount: number;
  timestamp: number;
  receiver: string;
  sender: string;
}
export type TransactionArgs = {
  sender: string;
  receiver: string;
  amount: number;
  privateKey: string;
};
