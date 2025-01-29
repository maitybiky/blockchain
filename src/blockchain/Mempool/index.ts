import mempoolStore from "../../state/memPoolStore";
import { TransactionData } from "../Transaction/type";
import { IMempool } from "./type";

class Mempool implements IMempool {
  private static instance: Mempool;
  private transactions: Record<string, TransactionData>;

  private constructor() {
    this.transactions = {};
  }

  static getTheMemPool() {
    if (!Mempool.instance) {
      Mempool.instance = new Mempool();
    }
    return Mempool.instance;
  }
  serializeMemPool(data: Partial<IMempool>) {
    // this update the local blockchain instance (single) with plain object
    Object.assign(this, data);
  }
  // Method to add a transaction to the mempool
  async addTransaction(transaction: TransactionData) {
    const txHash = transaction.hash;
    if (!this.transactions[txHash]) {
      this.transactions[txHash] = transaction;
    } else {
    }

    const { updateMemPool } = mempoolStore.getState();
    updateMemPool(this);
  }

  // Method to remove a transaction from the mempool
  removeTransaction(txId: string): void {
    if (this.transactions[txId]) {
      delete this.transactions[txId];
    } else {
    }
  }

  // Method to get all transactions in the mempool
  getAllTransactions(): TransactionData[] {
    return Object.values(this.transactions);
  }

  // Method to clear the mempool (e.g., after transactions are mined)
  clearMempool(): void {
    this.transactions = {};
    console.log("Mempool cleared.");
  }

  // Method to get the size of the mempool
  getSize(): number {
    return Object.keys(this.transactions).length;
  }
}
export default Mempool;
