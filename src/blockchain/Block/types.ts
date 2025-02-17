import { TransactionData } from "../Transaction/type";

export interface IBlock {
  index: number; // Block number
  timestamp: number; // Timestamp when the block was created
  // transactions: ITransaction[]; // Array of transactions in the block
  previousHash: string | null; // Hash of the previous block
  hash: string | null; // Hash of the current block
  nonce: number; // Nonce used for proof-of-work
  difficulty: number; // Current difficulty level of mining
  mine(): void;
  printBlockDetails(): void;
  getTransaction(): TransactionData[];
  isVerifiedBlock(): boolean;
}

export type BlockArg = {
  index: number;
  timestamp: number;
  transactions: TransactionData[];
};
export type VerifyReturn = {
  transactions: TransactionData[];
  status: boolean;
};
