
import { ITransaction } from "../Transaction/type";

export interface IMempool {
  addTransaction(transaction: ITransaction): void;
  removeTransaction(txId: string): void;
  getAllTransactions(): ITransaction[];
  clearMempool(): void;
  getSize(): number;
}
