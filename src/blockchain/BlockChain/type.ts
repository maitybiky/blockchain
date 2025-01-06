import { IAccountModel } from "../../AccountModel/type";
import { IBlock } from "../Block/types";

// Interface for the blockchain
export interface IBlockchain {
  addBlock(data: IBlock): void;
  getBlock(index: number): IBlock | null;
  getChain(): IBlock[];
  isValid(): boolean;
  getLatestBlock(): IBlock | Pick<IBlock, "hash">;
  difficulty: number;
  nonce: number;
}
export type BlockChainArg = {
  account: IAccountModel;
  difficulty: number;
  nonce: number;
};
