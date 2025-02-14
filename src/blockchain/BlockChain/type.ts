import { IBlock } from "../Block/types";

// Interface for the blockchain
export interface IBlockchain {
  addBlock(data: IBlock): void;
  getBlock(index: number): IBlock | null;
  getChain(): IBlock[];
  isValid(): boolean;
  getLatestBlock(): IBlock | Pick<IBlock, "hash">;
  getDifficulty(): number;
  getNonce(): number;
  serializeChain(data: Partial<IBlockchain>): void;
}
export interface BlockChainObj {
  chain: IBlock[];
  difficulty: number;
  nonce: number;
}
export type BlockChainArg = {
  difficulty?: number;
  nonce?: number;
};
