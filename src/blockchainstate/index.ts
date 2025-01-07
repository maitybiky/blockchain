export const updateChain = (blockchain: any) => {
  localStorage.clear();
  const updatedBlockChain = { blockchain };
  localStorage.setItem("blockchain", JSON.stringify(updatedBlockChain));
};
