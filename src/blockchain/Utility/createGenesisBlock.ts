import Block from "../Block";
import { IBlock } from "../Block/types";
import Transaction from "../Transaction";
import { IWallet } from "../Wallet/type";

export const createGenesisBlock = async (
  wallet: IWallet,
  previousHash: string | null
): Promise<IBlock> => {
  try {
    const genesisTransaction = new Transaction({
      amount: 10000,
      privateKey: wallet.getPrivateKey(),
      receiver: wallet.getPublicKey(),
      sender: wallet.getPublicKey(),
    });
    await genesisTransaction.signTransaction(wallet.getPrivateKey());
    const genesisBlock = new Block({
      difficulty: 10,
      index: Date.now(),
      nonce: 111,
      previousHash,
      timestamp: Date.now(),
      transactions: [genesisTransaction],
    });
    await genesisBlock.mine();
    return genesisBlock;
  } catch (error) {
    throw error;
  }
};
