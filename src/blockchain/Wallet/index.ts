import Account from "../../AccountModel";
import { ITransaction } from "../Transaction/type";
import { generateKeyPair } from "../Utility/crypto";
import { getAccountKey } from "../Utility/getAccountKey";
import { IWallet, RKeyPair } from "./type";

class Wallet implements IWallet {
  private walletId: string | null;
  private userName: string;
  private privateKey: string;
  private publicKey: string;
  private transactions: ITransaction[];

  constructor(userName: string) {
    this.transactions = [];
    this.userName = userName;
    this.walletId = "";
    this.privateKey = "";
    this.publicKey = "";
    this.walletId = "";
  }
   serializeWallet(data: Partial<IWallet>) {
    // this update the local blockchain instance (single) with plain object
    Object.assign(this, data);
  }
  async createKeyValuePair(): Promise<RKeyPair> {
    try {
      const { privateKey, publicKey } = await generateKeyPair();

      return {
        privateKey,
        publicKey,
      };
    } catch (error) {
      throw error;
    }
  }

  async active(): Promise<void> {
    try {
      const keyPair = await this.createKeyValuePair();
      this.privateKey = keyPair.privateKey;
      this.publicKey = keyPair.publicKey;
      this.walletId = await this.genWalletId(this.publicKey);

      Account.getTheAccount().createAccount(this);
    } catch (error) {
      throw error;
    }
  }

  // Getters
  private async genWalletId(
    publicKey: string | undefined = this.publicKey
  ): Promise<string> {
    if (this.walletId) return this.walletId;
    try {
      if (!publicKey) throw new Error("Invalid key or Account not active");

      return this.walletId || (await getAccountKey(publicKey));
    } catch (error) {
      throw error;
    }
  }
  getWalletId(): string | null {
    return this.walletId;
  }

  getUserName(): string {
    return this.userName;
  }

  getPrivateKey(): string {
    return this.privateKey;
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  getTransactions(): ITransaction[] {
    return this.transactions;
  }
}

export default Wallet;
