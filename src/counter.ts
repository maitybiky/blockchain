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
    this.eow = true;
  }
}

class Trie {
  root: TPatriciaTrieNode;
  constructor() {
    this.root = new PatriciaNode();
  }
  add(word: string) {
    let current = this.root;

    let isMatched = false;
    // if current root has children the sent the uncommon string to childs
    current.children.forEach((value, key) => {
      const commonIndex = this.getCommonPrefixLength(key, word);
      if (commonIndex > 0) {
        // if new word have some common in the existing tree
        isMatched = true;

        if (commonIndex < key.length) {
          // if there any uncommon substring left , so add them to child list

          const commonPrefix = key.slice(0, commonIndex);
          const restKey = key.slice(commonIndex);

          // Update the map key
          const childNode = current.children.get(key);
          current.children.delete(key);
          childNode!.prefix = commonPrefix;
          childNode!.eow = false;
          current.children.set(commonPrefix, childNode!);

          //push the rest word to the children
          const restKeyNode = new PatriciaNode(restKey);
          value.children.set(restKey, restKeyNode);
        }

        // if new word completly matched with existing node
        const restWord = word.slice(commonIndex);
        const restWordNode = new PatriciaNode(restWord);
        value.children.set(restWord, restWordNode);

        // this.add(childWord, value, ++sublnt);
        return;
      }
      if (key.length === commonIndex) {
        value.eow = true;
      }
    });

    if (!isMatched) {
      const initNode = new PatriciaNode(word);
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
t.add("apple");
t.add("api");
t.add("application");
t.add("applause");
t.add("appetite");
t.add("triple");
t.add("trap");
t.add("apple");
t.add("appraise");
t.add("apparatus");
t.add("appendix");
t.add("apprentice");
t.add("appoint");
t.add("mumbai");
t.add("bottle");
t.add("dsa");
t.add("surajit");
t.add("javascript");
t.add("god");
t.add("pens");
t.add("ap");
t.search("app");

function getChilds(root: TPatriciaTrieNode, pStr = "") {
  if (root.eow) {
    console.log("object :>> ", pStr + root.prefix);
  }
  if (root.children.size === 0) return;
  root.children.forEach((value) => {
    getChilds(value, pStr + root.prefix);
  });
}

getChilds(t.root);
export default t;
