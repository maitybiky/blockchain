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
    console.log("word,root.", word, current);

    current.children.forEach((value, key) => {
      if (word.startsWith(key)) {
        const commonIndex = this.getCommonPrefixLength(key, word);
        console.log("commonIndex", commonIndex);
        const childWord = word.slice(commonIndex);
        this.add(childWord, value, ++sublnt);
        return;
      }
    });

    if (sublnt === 0) {
      //initial case
      console.log("init");
      const initNode = new PatriciaNode(word[0]);
      current.children.set(word[0], initNode);
      this.add(word.slice(1), initNode, ++sublnt);
    } else if (current.children.size === 0) {
      console.log("orphane");
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
t.add("pen");
t.add("pens");
const words: string[] = [];
let w = "";
getChilds(t.root);

function getChilds(root: TPatriciaTrieNode) {
  root.children.forEach((value, key) => {
    console.log("value.eow,value.prefix", value.eow, value.prefix);
    if (value.eow) {
      w += value.prefix;
      words.push(w);
      getChilds(value);
    } else {
      w += value.prefix;
      getChilds(value);
    }
  });
}
console.log("words", words);
export default t;
