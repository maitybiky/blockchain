type TPatriciaTrieNode = {
  prefix: string;
  children: TPatriciaTrieNode[];
  eow: boolean;
};

class PatriciaNode implements TPatriciaTrieNode {
  prefix: string;
  children: TPatriciaTrieNode[];
  eow: boolean;

  constructor(prefix = "") {
    this.prefix = prefix;
    this.children = [];
    this.eow = false;
  }
}

class Trie {
  root: TPatriciaTrieNode;
  constructor() {
    this.root = new PatriciaNode();
  }
  add(word: string, root = this.root) {
    let current = root || this.root;
    console.log("word :>> ", word);

    let isMatched = false;
    // if current root has children the sent the uncommon string to childs
    current.children.forEach((value) => {
      const key = value.prefix;
      const commonIndex = this.getCommonPrefixLength(key, word);
      if (word === "application") {
        console.log("commonIndex,value :>> ", commonIndex, key.length, value);
      }
      if (commonIndex > 0) {
        // if new word have some common in the existing tree
        isMatched = true;

        if (commonIndex < key.length) {
          // if there any uncommon substring left , so add them to child list

          const commonPrefix = key.slice(0, commonIndex);
          const restKey = key.slice(commonIndex);

          const restKeyNode = new PatriciaNode(restKey);

          //change the matched child node
          value.children.push(restKeyNode);
          value.prefix = commonPrefix;
        }

        const restWord = word.slice(commonIndex);
        const restWordNode = new PatriciaNode(restWord);
        value.children.push(restWordNode);

        // this.add(childWord, value, ++sublnt);
        return;
      }
    });

    if (!isMatched) {
      const initNode = new PatriciaNode(word);
      current.children.push(initNode);
    }
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

function getChilds(root: TPatriciaTrieNode, pStr = "") {
  if (root.eow) {
    console.log("object :>> ", pStr + root.prefix);
  }
  if (root.children.length === 0) return;
  root.children.forEach((value) => {
    getChilds(value, pStr + root.prefix);
  });
}

getChilds(t.root);
export default t;
