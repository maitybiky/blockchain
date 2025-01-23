type TPatriciaTrieNode = {
  prefix: string;
  children: Map<string, TPatriciaTrieNode>;
  eow: boolean;
};

class PatriciaNode implements TPatriciaTrieNode {
  prefix: string;
  children: Map<string, TPatriciaTrieNode>;
  eow: boolean;

  constructor(prefix = "") {
    this.prefix = prefix;
    this.children = new Map();
    this.eow = false;
  }
}

class Trie {
  root: TPatriciaTrieNode;
  constructor() {
    this.root = new PatriciaNode();
  }
  add(word: string, node: PatriciaNode = this.root) {
    if (!word) return;

    let current = node;

    let isMatched = false;
    // if current root has children the sent the uncommon string to childs
    current.children.forEach((value, key) => {
      const commonIndex = this.getCommonPrefixLength(key, word);

      if (commonIndex > 0) {
        isMatched = true;

        const commonPrefix = key.slice(0, commonIndex);
        const restKey = key.slice(commonIndex);
        const restWord = word.slice(commonIndex);

        // if new word have some common in the existing tree
       
        if (commonIndex < key.length) {
          // break the existing key and add the rest of the unmatch as its child
        
          const matchedNode = current.children.get(key);
          console.log('current.children bd :>> ', current.children);
          current.children.delete(key);
          console.log('current.children ad :>> ', current.children);

          matchedNode!.prefix = commonPrefix;
          matchedNode!.eow = false;
     console.log('matchedNode :>> ', matchedNode);
          current.children.set(commonPrefix, matchedNode!);
          console.log('current.children am :>> ', current.children);

          this.add(restKey, matchedNode);
          this.add(restWord, matchedNode);
        }
        if (key.length === commonIndex) {

          this.add(restWord, value);
          value.eow = true;
        }
        return;
      }
    });

    if (!isMatched) {
      const initNode = new PatriciaNode(word);
      initNode.eow = true;
      console.log('initNode :>> ', initNode);
      current.children.set(word, initNode);
    }
  }

  search(word: string, s: string[] = [], node: PatriciaNode = this.root) {
    const suggetions: string[] = [...s];
    const current = node || this.root;
    current.children.forEach((value, key) => {
      const commonPrefix = this.getCommonPrefixLength(key, word);
      if (commonPrefix > 0) {
        value.children.forEach((childvalue) => {
          if (childvalue.eow) suggetions.push(value.prefix + childvalue.prefix);
        });
      }
    });
    console.log("suggetions :>> ", suggetions);
  }
  getCommonPrefixLength(word1: string, word2: string): number {
    let i = 0;
    while (word1.length > i && word2.length > i && word1[i] === word2[i]) {
      i++;
    }
    return i;
  }
}
const t = new Trie();
t.add("app");
t.add("apil");
// t.add("apin");
// t.add("api");
// t.add("apisure");
// t.add("appo");
// t.add("apple");
// t.add("application");
// t.add("applause");
// t.add("appetite");
// t.add("triple");
// t.add("trap");
// t.add("apple");
// t.add("appraise");
// t.add("apparatus");
// t.add("appendix");
// t.add("apprentice");
// t.add("appoint");
// t.add("mumbai");
// t.add("bottle");
// t.add("dsa");
// t.add("surajit");
// t.add("javascript");
// t.add("god");
// t.add("apil");
// t.add("apin");
// t.add("pens");
// t.add("ap");
// t.search("app");

let tree: any = {};
function getChilds(root: TPatriciaTrieNode) {
  if (root.children.size === 0) return [root.prefix];
  const key = root.prefix || "_ROOT_";

  root.children.forEach((value) => {
    tree[key] = [...(tree[key] || []), ...getChilds(value)];
  });
  return tree[key];
}

getChilds(t.root);

export default t;
