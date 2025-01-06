import Account from "../../AccountModel";
import { ITransaction } from "../Transaction/type";
import createHash from "../Utility/createHash";
import { verifySignature } from "../Utility/crypto";

import { BlockArg, IBlock } from "./types";

class Block implements IBlock {
  private transactions: ITransaction[];
  private isVerified: boolean;
  index: number;
  timestamp: number;
  previousHash: string | null;
  hash: string | null;
  nonce: number;
  difficulty: number;

  constructor(data: BlockArg) {
    this.isVerified = false;
    this.index = data.index;
    this.timestamp = data.timestamp;
    this.transactions = data.transactions;
    this.previousHash = data.previousHash;
    this.nonce = data.nonce;
    this.difficulty = data.difficulty;
    this.hash = null;
    this.genrateHash();
  }

  private async genrateHash(): Promise<string> {
    // Helper function to calculate the hash of a block
    try {
      return await createHash(this);
    } catch (error) {
      throw error;
    }
  }
  private async verifyTransactions(): Promise<ITransaction[]> {
    try {
      if (!this.transactions.every((it) => it.signature))
        throw new Error("Signature not found");

      const verifyPromise = this.transactions.map(async (transaction) => {
        if (transaction.signature) {
          const data = {
            sender: transaction.sender,
            receiver: transaction.receiver,
            timestamp: transaction.timestamp,
            hash: transaction.hash,
            amount: transaction.amount,
          };
          return {
            transaction,
            status: await verifySignature(
              transaction.sender,
              JSON.stringify(data),
              transaction.signature
            ),
          };
        }
      });
      const verifyStatus = (await Promise.all(verifyPromise)).filter(
        (it) => it != undefined
      );
      return verifyStatus
        .filter((it) => it?.status && it.transaction)
        .map((result) => result?.transaction);
    } catch (error) {
      throw error;
    }
  }
  private verifyBalance(): ITransaction[] {
    const accounts = new Account();
    const verifiedTransactions = this.transactions.filter((transaction) => {
      return (
        transaction.amount >= accounts.getWalletBalance(transaction.sender)
      );
    });
    return verifiedTransactions;
  }
  async mine() {
    try {
      this.transactions = this.verifyBalance();
      this.transactions = await this.verifyTransactions();
      const h = await this.genrateHash();
      this.hash = h;
      this.isVerified = true;
    } catch (error) {
      throw error;
    }
  }
  isVerifiedBlock(): boolean {
    return this.isVerified;
  }
  getTransaction() {
    return this.transactions;
  }
  printBlockDetails(): void {
    console.table({
      prevHash: this.previousHash,
      hash: this.hash,
      id: this.index,
    });
  }
}

export default Block;
