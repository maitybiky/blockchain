import Account from "./AccountModel";
import Block from "./blockchain/Block";
import Blockchain from "./blockchain/BlockChain";
import Transaction from "./blockchain/Transaction";
import { getAccountKey } from "./blockchain/Utility/getAccountKey";
import Wallet from "./blockchain/Wallet";
import { IWallet } from "./blockchain/Wallet/type";
import "./style.css";
const account = new Account();

const main = async () => {
  try {
    var blockchain = new Blockchain({ difficulty: 10, nonce: 111, account });
    console.log("Welcome TO BC");

    const genesis = new Wallet("genesis");
    await genesis.active();

    const genesisWalletId = await getAccountKey(genesis.getPublicKey());
    account.creditCoin({
      walletId: genesisWalletId,
      amount: 1000,
    });

    console.log("ACCCC :>> ", account.getAllWalletBalance());

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
      console.log("sender :>> ", sender);
      console.log("receiver :>> ", receiver);
      try {
        const createTransactionRequest = new Transaction({
          amount: amount,
          privateKey: sender.getPrivateKey(),
          receiver: receiver.getPublicKey(),
          sender: sender.getPublicKey(),
        });
        await createTransactionRequest.signTransaction(sender.getPrivateKey());

        const block = new Block({
          difficulty: blockchain.difficulty,
          nonce: blockchain.nonce,
          index: Date.now(),
          previousHash: blockchain.getLatestBlock().hash,
          timestamp: Date.now(),
          transactions: [createTransactionRequest],
        });
        await block.mine();
        await blockchain.addBlock(block);
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
    console.log("XXX :>> ", account.getAllWalletBalance());

    // biky send 20 to shopkeeper rock
    await INIT_TRANSACTION({
      sender: biky,
      receiver: rock,
      amount: 20,
    });
    console.log("account :>> ", account.getAllWalletBalance());

    // User Interface

    const transactions: string[] = [];
    blockchain.getChain().forEach((block) => {
      block.getTransaction().forEach((transaction) => {
        transactions.push(
          `<button id="counter" type="button">${transaction.sender.slice(
            0,
            5
          )}  - ${transaction.amount} - ${transaction.receiver.slice(
            0,
            5
          )} </button>`
        );
      });
    });
    document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div> 
    <h1>Blockchain</h1>
    <div class="card">
      ${transactions.join("---")}
    </div>
  </div>
`;
    blockchain.getBalanceSet();
    console.log(account.getAllWalletBalance());
  } catch (error) {
    console.log("error :>> ", error);
  }
};
main();
