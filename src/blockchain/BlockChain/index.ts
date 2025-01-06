import Account from "../../AccountModel";
import { IAccountModel } from "../../AccountModel/type";
import { IBlock } from "../Block/types";
import { createGenesisBlock } from "../Utility/createGenesisBlock";
import { getAccountKey } from "../Utility/getAccountKey";
import { IWallet } from "../Wallet/type";

import { BlockChainArg, IBlockchain } from "./type";

// Blockchain class implementing the interface
class Blockchain implements IBlockchain {
  private static instance: Blockchain;

  private chain: IBlock[];
  private account: IAccountModel;

  difficulty: number;
  nonce: number;
  constructor({ difficulty, nonce, account }: BlockChainArg) {
    this.chain = [];
    this.difficulty = difficulty;
    this.nonce = nonce;
    this.account = account;
  }

  // Adds a new block to the blockchain
  async addBlock(newBlock: IBlock): Promise<void> {
    // update accounts balances
    if (newBlock.isVerifiedBlock()) {
      const accountIdsPromise = newBlock
        .getTransaction()
        .map(async (transaction) => {
          try {
            const senderWalletId = await getAccountKey(transaction.sender);
            const receiverWalletId = await getAccountKey(transaction.receiver);
            console.log("senderWalletId :>> ", senderWalletId);
            console.log("receiverWalletId :>> ", receiverWalletId);
            this.account.creditCoin({
              walletId: receiverWalletId,
              amount: transaction.amount,
            });
            this.account.debitCoin({
              walletId: senderWalletId,
              amount: transaction.amount,
            });
          } catch (error) {
            throw error;
          }
        });

      await Promise.all(accountIdsPromise);

      this.chain.push(newBlock);
    } else {
      console.error("Block is not verified : ", newBlock);
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
          (balance[transaction.receiver] || 0) + transaction.amount;
      });
    });
  }
  // Validates the integrity of the blockchain
  isValid(): boolean {
    return true;
  }
}

export default Blockchain;
