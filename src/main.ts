import Account from "./AccountModel";
import Block from "./blockchain/Block";
import Blockchain from "./blockchain/BlockChain";
import Mempool from "./blockchain/Mempool";
import Transaction from "./blockchain/Transaction";
import Wallet from "./blockchain/Wallet";
import { IWallet } from "./blockchain/Wallet/type";
import { serializeClasses } from "./state/serializeClasses";
// import t from "./counter.js";
import "./style.css";

export const account = Account.getTheAccount();
export const mempool = Mempool.getTheMemPool();
export const blockchain = Blockchain.getBlockChain();

export const main = async () => {
  serializeClasses();
  return;
  try {
    console.log("Welcome TO BC");

    const genesis = new Wallet("genesis");
    await genesis.active();

    console.log("Current Accounts :>> ", account.getAllWalletBalance());

    const surajit = new Wallet("surajit");
    await surajit.active();
    const biky = new Wallet("biky");
    await biky.active();
    const rock = new Wallet("rock");
    await rock.active();

    // split money from air
    // await blockchain.pushGenesisBlock(genesis);
    const INIT_TRANSACTION = async ({
      sender,
      receiver,
      amount,
    }: {
      sender: IWallet;
      receiver: IWallet;
      amount: number;
    }) => {
      try {
        const createTransactionRequest = new Transaction({
          amount: amount,
          privateKey: sender.getPrivateKey(),
          receiver: receiver.getPublicKey(),
          sender: sender.getPublicKey(),
        });
        await createTransactionRequest.signTransaction(sender.getPrivateKey());
        mempool.addTransaction(createTransactionRequest);
      } catch (error) {
        throw error;
      }
    };
    const trPromise = [surajit, biky, rock].map(async (user) => {
      await INIT_TRANSACTION({
        sender: genesis,
        receiver: user,
        amount: 100,
      });
    });
    await Promise.all(trPromise);

    // biky send 20 to shopkeeper rock
    await INIT_TRANSACTION({
      sender: biky,
      receiver: rock,
      amount: 20,
    });
    await INIT_TRANSACTION({
      sender: rock,
      receiver: surajit,
      amount: 78,
    });
  } catch (error) {
    console.error("error :>> ", error);
  }
};

export async function processMempool() {
  try {
    const memPoolSize = mempool.getSize();

    if (memPoolSize) {
      console.log("Mempool initiated");
      const mempoolProcesses = mempool
        .getAllTransactions()
        .map(async (transaction) => {
          const block = new Block({
            index: Date.now(),
            timestamp: Date.now(),
            transactions: [transaction],
          });

          await block.mine();

          await blockchain.addBlock(block);
        });

      await Promise.all(mempoolProcesses)
        .then(() => {
          console.log("blockchain :>> ", blockchain);
          mempool.clearMempool();
        })
        .catch((err) => {
          throw err;
        });
    }
  } catch (error) {
    throw error;
  } finally {
    // Resume after 5 seconds
    setTimeout(processMempool, 5000);
  }
}
