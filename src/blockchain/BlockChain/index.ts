import Account from "../../AccountModel";
import { IAccountModel } from "../../AccountModel/type";
import { IBlock } from "../Block/types";
import { getAccountKey } from "../Utility/getAccountKey";

import { BlockChainArg, IBlockchain } from "./type";

// Blockchain class implementing the interface
class Blockchain implements IBlockchain {
  private static instance: Blockchain;
  private chain: IBlock[];
  private account: IAccountModel;
  private difficulty: number;
  private nonce: number;

  private constructor({ difficulty, nonce }: BlockChainArg) {
    this.chain = [];
    this.difficulty = difficulty;
    this.nonce = nonce;
    this.account = Account.getTheAccount();
  }

  static getBlockChain() {
    return (
      Blockchain.instance || new Blockchain({ difficulty: 10, nonce: 111 })
    );
  }
  // Adds a new block to the blockchain
  async addBlock(newBlock: IBlock): Promise<void> {
    console.log("here");
    // update accounts balances

    try {
      if (newBlock.isVerifiedBlock()) {
        const accountIdsPromise = newBlock
          .getTransaction()
          .map(async (transaction) => {
            const senderWalletId = await getAccountKey(transaction.getSender());
            const receiverWalletId = await getAccountKey(
              transaction.getReceiver()
            );
            console.log(
              `${senderWalletId} -> ${transaction.getAmount()} -> ${receiverWalletId}`
            );
            this.account.creditCoin({
              walletId: receiverWalletId,
              amount: transaction.getAmount(),
            });
            this.account.debitCoin({
              walletId: senderWalletId,
              amount: transaction.getAmount(),
            });
          });

        try {
          if (newBlock.getTransaction().length === 0) {
            throw new Error("Block Cannot be added . empty transaction:");
          }
          await Promise.all(accountIdsPromise);
          newBlock.previousHash = this.getLatestBlock().hash;
          // newBlock.
          this.chain.push(newBlock);
          console.log("this.account", this.account);
        } catch (error) {
          throw error;
        }
      } else {
        console.error("Block is not verified : ", newBlock);
      }
    } catch (error) {
      throw error;
    }
  }

  // Retrieves a block by its index
  getBlock(index: number): IBlock | null {
    return this.chain.find((block) => block.index === index) || null;
  }

  // Retrieves the entire blockchain
  getChain(): IBlock[] {
    return this.chain;
  }
  getLatestBlock(): IBlock | Pick<IBlock, "hash"> {
    if (this.chain.length === 0) {
      return { hash: null };
    }
    return this.chain[this.chain.length - 1];
  }
  getBalanceSet() {
    const balance: any = {};
    this.getChain().forEach((it) => {
      it.printBlockDetails();
      it.getTransaction().forEach((transaction) => {
        balance[transaction.getSender()] =
          (balance[transaction.getSender()] || 0) - transaction.getAmount();

        balance[transaction.getReceiver()] =
          (balance[transaction.getReceiver()] || 0) + transaction.getAmount();
      });
    });
  }
  // Validates the integrity of the blockchain
  isValid(): boolean {
    return true;
  }
  getDifficulty(): number {
    return this.difficulty;
  }
  getNonce(): number {
    return this.nonce;
  }
}

export default Blockchain;
