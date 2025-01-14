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
  add(word: string, root = this.root, sublnt = 0) {
    let current = root || this.root;
    const isLeaf = current.children.size === 0;
    if (word == "pplication") {
      console.log("current :>> ", current);
    }

    let isMatched = false;
    // if current root has children the sent the uncommon string to childs
    current.children.forEach((value, key) => {
      if (word.startsWith(key)) {
        isMatched = true;
        const commonIndex = this.getCommonPrefixLength(key, word);
        const childWord = word.slice(commonIndex);
        this.add(childWord, value, ++sublnt);
        return;
      }
    });

    //initial case where sublnt is 0
    if (sublnt === 0) {
      const initNode = new PatriciaNode(word[0]);
      current.children.set(word[0], initNode);
      this.add(word.slice(1), initNode, ++sublnt);
    } else if ((isLeaf && word) || !isMatched) {
      // this case refer the current root has no child to compare further so add in the list
      const children = new PatriciaNode(word);
      children.eow = true;
      current.children.set(word, children);
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
// t.add("pens");

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
