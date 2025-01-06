import { signData } from "../Utility/crypto";
import { ITransaction, TransactionArgs } from "./type";

class Transaction implements ITransaction {
  sender: string;
  receiver: string;
  amount: number;
  timestamp: number;
  signature: Uint8Array | null;
  hash: string;

  constructor(tRequest: TransactionArgs) {
  
    this.sender = tRequest.sender;
    this.receiver = tRequest.receiver;
    this.amount = tRequest.amount;
    this.timestamp = Date.now();
    this.signature = null;
    this.hash = this.createHash();
  }

  public toString(): string {
    return JSON.stringify(this);
  }
  private createHash(): string {
    return JSON.stringify(this);
  }
  async signTransaction(privateKey: string): Promise<ArrayBuffer> {
    try {
      const data = {
        sender: this.sender,
        receiver: this.receiver,
        timestamp: this.timestamp,
        hash: this.hash,
        amount: this.amount,
      };
      const signature = await signData(privateKey, JSON.stringify(data));
      this.signature = signature;
      return signature;
    } catch (error) {
      throw error;
    }
  }
}
export default Transaction;
