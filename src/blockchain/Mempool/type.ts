
import {  TransactionData } from "../Transaction/type";

export interface IMempool {
  addTransaction(transaction: TransactionData): void;
  removeTransaction(txId: string): void;
  getAllTransactions(): TransactionData[];
  clearMempool(): void;
  getSize(): number;
}
