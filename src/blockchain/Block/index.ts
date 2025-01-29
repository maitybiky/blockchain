import Account from "../../AccountModel";
import Blockchain from "../BlockChain";
import { TransactionData } from "../Transaction/type";
import { createHash } from "../Utility/createHash";
import { verifySignature } from "../Utility/crypto";

import { BlockArg, IBlock } from "./types";

class Block implements IBlock {
  private transactions: TransactionData[];
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
    this.previousHash = null;
    this.nonce = Blockchain.getBlockChain().getNonce();
    this.difficulty = Blockchain.getBlockChain().getDifficulty();
    this.hash = null;
  }

  private async genrateHash(): Promise<string> {
    // Helper function to calculate the hash of a block
    try {
      return await createHash(this);
    } catch (error) {
      throw error;
    }
  }
  private async verifyTransactions(): Promise<TransactionData[]> {
    try {
      if (!this.transactions.every((it) => it.signature))
        throw new Error("Signature not found");

      const verifyPromise = this.transactions.map(async (transaction) => {
        const transactionSigntaure = transaction.signature;
        if (transactionSigntaure) {
          const data = transaction.toString();
          return {
            transaction,
            status: await verifySignature(
              transaction.sender,
              data,
              transactionSigntaure
            ),
          };
        }
      });
      const verifyStatus = (await Promise.all(verifyPromise)).filter(
        (it) => it != undefined
      );
      const signatureVerified: TransactionData[] = [];
      const signatureFailed: TransactionData[] = [];

      verifyStatus.map((txState) => {
        if (txState.status) {
          signatureVerified.push(txState.transaction);
        } else {
          signatureFailed.push(txState.transaction);
        }
      });

      signatureFailed.forEach((it) => {
        console.error("Signature Failed", it.hash);
      });

      return signatureVerified;
    } catch (error) {
      throw error;
    }
  }
  private verifyBalance(): TransactionData[] {
    const accounts = Account.getTheAccount();

    const verifiedTransactions: TransactionData[] = [];
    const InsufficientTransaction: TransactionData[] = [];
    this.transactions.map((transaction) => {
      if (
        transaction.amount >=
        accounts.getWalletBalance(transaction.sender)
      ) {
        verifiedTransactions.push(transaction);
      } else {
        InsufficientTransaction.push(transaction);
      }
    });
    InsufficientTransaction.forEach((t) => {
      console.error("Insufficient Amount", t);
    });
    return verifiedTransactions;
  }
  async mine() {
    try {
      const verifiedTransactions = this.verifyBalance();

      this.transactions = verifiedTransactions;

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
