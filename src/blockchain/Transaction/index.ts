import { createHash } from "../Utility/createHash";
import { signData } from "../Utility/crypto";
import {
  ITransaction,
  TransactionArgs,
  TransactionSignaturePayload,
} from "./type";

class Transaction implements ITransaction {
  private sender: string;
  private receiver: string;
  private amount: number;
  private timestamp: number;
  private signature: string | null;
  private hash: string | null;

  constructor(tRequest: TransactionArgs) {
    this.sender = tRequest.sender;
    this.receiver = tRequest.receiver;
    this.amount = tRequest.amount;
    this.timestamp = Date.now();
    this.signature = null;
    this.hash = null;
  }

  // Getter methods to access private properties
  public getSender(): string {
    return this.sender;
  }

  public getReceiver(): string {
    return this.receiver;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getTimestamp(): number {
    return this.timestamp;
  }

  public getSignature(): string | null {
    return this.signature;
  }

  public async getHash(): Promise<string> {
    return this.hash || (await this.createHash());
  }

  // Converts transaction to string
  public toString(): string {
    const data = {
      sender: this.sender,
      receiver: this.receiver,
      amount: this.amount,
      timestamp: this.timestamp,
    };
    return JSON.stringify(data);
  }

  // Creates a hash based on transaction data
  private async createHash(): Promise<string> {
    return await createHash(this.toString());
  }

  // Signs the transaction and assigns the signature
  public async signTransaction(privateKey: string): Promise<string> {
    const txHash = this.hash || (await this.getHash());
    this.hash = txHash;
    try {
      const transactionPayload: TransactionSignaturePayload = {
        amount: this.amount,
        timestamp: this.timestamp,
        receiver: this.receiver,
        sender: this.sender,
      };
      const signature = await signData(
        privateKey,
        JSON.stringify(transactionPayload)
      );
      this.signature = signature;
      return signature;
    } catch (error) {
      throw error;
    }
  }
}

export default Transaction;
