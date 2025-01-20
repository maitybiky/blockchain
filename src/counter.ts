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
  buffer: string[];
  constructor() {
    this.root = new PatriciaNode();
    this.buffer = [];
  }
  add(word: string, node: PatriciaNode = this.root) {
    if (!word) return;

    let current = node;

    let isMatched = false;
    const branchs = current.children;
    // if current root has children the sent the uncommon string to childs
    branchs.forEach((value, key) => {
      const commonIndex = this.getCommonPrefixLength(key, word);

      if (commonIndex > 0) {
        isMatched = true;
        if (commonIndex === word.length && commonIndex === key.length) {
          // current.children.get(key)!.eow = true;
          value.eow = true;
          console.log("value", value);
        }
        const commonPrefix = key.slice(0, commonIndex);
        const restKey = key.slice(commonIndex);
        const restWord = word.slice(commonIndex);

        // if new word have some common in the existing tree

        if (commonIndex < key.length) {
          // break the existing key and add the rest of the unmatch as its child

          const matchedNode = current.children.get(key);
          current.children.delete(key);
          matchedNode!.prefix = commonPrefix;
          matchedNode!.eow = false;
          current.children.set(commonPrefix, matchedNode!);
          if (restKey) {
            this.add(restKey, matchedNode);
          }
          if (restWord) {
            this.add(restWord, matchedNode);
          }
        }
        if (key.length === commonIndex) {
          this.add(restWord, value);
        }

        return;
      }
    });

    if (!isMatched) {
      const initNode = new PatriciaNode(word);
      initNode.eow = true;
      current.children.set(word, initNode);
    }
  }

  search(word = "") {
    if (!word) return [];
    this.root.children.forEach((value, key) => {
      if (this.getCommonPrefixLength(key, word) > 0) {
        this.buildAllWord(value);
      }
    });

    console.log("this.buffer", this.buffer);
    this.buffer = [];
  }
  buildAllWord(node: PatriciaNode = this.root, prefix = "") {
    if (node.children.size === 0) return;
    if (node.eow) this.buffer.push(node.prefix);

    const current_prefix = prefix + node.prefix;
    node.children.forEach((value) => {
      if (value.eow) {
        this.buffer.push(current_prefix + value.prefix);
      }
      this.buildAllWord(value, current_prefix);
    });
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
t.add("apin");
t.add("apil");
// t.add("api");
t.add("ap");
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
t.add("surajit");
t.add("javascript");
t.add("java");
t.add("god");
// t.add("apil");
// t.add("apin");
t.add("pens");
// t.add("ap");
// t.search("app");
t.search("a");

export default t;
