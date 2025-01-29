import Mempool from "../../../../blockchain/Mempool";

export const addToMemPool = (transaction: any) => {
  console.log("transaction  recieve:>> ", transaction);
  Mempool.getTheMemPool().addTransaction(transaction);
};
