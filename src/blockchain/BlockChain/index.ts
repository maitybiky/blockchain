import Account from "../../AccountModel";
import { IAccountModel } from "../../AccountModel/type";
import { broadcastFullChain } from "../../Network/peer/gossips/request/broadCastFullChain";
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

  private constructor({ difficulty = 10, nonce = 0 }: BlockChainArg) {
    this.chain = [];
    this.difficulty = difficulty;
    this.nonce = nonce;
    this.account = Account.getTheAccount();
  }
  serializeChain(data: Partial<IBlockchain>) {
    // this update the local blockchain instance (single) with plain object
    Object.assign(this, data);
  }

  static getBlockChain() {
    if (!Blockchain.instance) {
      Blockchain.instance = new Blockchain({ difficulty: 10, nonce: 0 });
    }
    return Blockchain.instance;
  }
  // Adds a new block to the blockchain
  async addBlock(newBlock: IBlock): Promise<void> {
    // update accounts balances

    try {
      if (newBlock.isVerifiedBlock()) {
        const accountIdsPromise = newBlock
          .getTransaction()
          .map(async (transaction) => {
            const senderWalletId = await getAccountKey(transaction.sender);
            const receiverWalletId = await getAccountKey(transaction.receiver);
            console.log(
              `${senderWalletId} -> ${transaction.amount} -> ${receiverWalletId}`
            );
  
            Account.getTheAccount().creditCoin({
              walletId: receiverWalletId,
              amount: transaction.amount,
            });
            Account.getTheAccount().debitCoin({
              walletId: senderWalletId,
              amount: transaction.amount,
            });
          });

        try {
          if (newBlock.getTransaction().length === 0) {
            throw new Error("Block Cannot be added . empty transaction:");
          }
          await Promise.all(accountIdsPromise);
          newBlock.previousHash = this.getLatestBlock().hash;

          //------------------------------------------------------------------------------------ ⛏️🔗💥 pushing block 🌍💸

          this.chain.push(newBlock);
          this.nonce++;
          broadcastFullChain()
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
        balance[transaction.sender] =
          (balance[transaction.sender] || 0) - transaction.amount;

        balance[transaction.receiver] =
          (balance[transaction.receiver] || 0) + transaction.receiver;
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
