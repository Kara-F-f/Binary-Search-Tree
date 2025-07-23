class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(arr) {
    this.root = this.buildTree(arr);
  }

  buildTree(array) {
    array.sort((a, b) => a - b);
    let cleanArr = [];
    cleanArr.push(array[0]);
    for (let i = 1; i < array.length; i++) {
      if (array[i] !== array[i - 1]) {
        cleanArr.push(array[i]);
      }
    }

    function sortedArrayToBST(arr, start, end) {
      if (start > end) return null;

      let mid = start + Math.floor((end - start) / 2);
      let root = new Node(arr[mid]);

      root.left = sortedArrayToBST(arr, start, mid - 1);
      root.right = sortedArrayToBST(arr, mid + 1, end);
      return root;
    }

    let node = sortedArrayToBST(cleanArr, 0, cleanArr.length - 1);
    return node;
  }

  print() {
    let node = this.root;
    const prettyPrint = (node, prefix = "", isLeft = true) => {
      if (node === null) {
        return;
      }
      if (node.right !== null) {
        prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
      }
      console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
      if (node.left !== null) {
        prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
      }
    };
    prettyPrint(node);
  }

  insert(value) {
    let root = this.root;
    const newNode = new Node(value);

    while (root.left !== null || root.right !== null) {}
    root.data > value ? (root.left = newNode) : (root.right = newNode);
  }

  deleteItem(value) {
    let root = this.root;
    let prevNode;
    let direction;
    let successor;
    let prevSuccessor;

    while (root.data !== value) {
      prevNode = root;
      if (root.data > value) {
        root = root.left;
        direction = "left";
      } else {
        root = root.right;
        direction = "right";
      }
    }

    if (root.left === null && root.right === null) {
      direction === "left" ? (prevNode.left = null) : (prevNode.right = null);
      return;
    } else if (
      (root.left && root.left.left === null && root.left.right === null) ||
      (root.right && root.right.left === null && root.right.right === null)
    ) {
      root = root.right;
      direction === "left" ? (prevNode.left = root) : (prevNode.right = root);
      return;
    } else {
      successor = root.right;
      while (successor.left !== null) {
        prevSuccessor = successor;
        successor = successor.left;
      }
      root.data = successor.data;
      if (successor.right === null) {
        prevSuccessor.left = null;
      } else {
        prevSuccessor.left = successor.right;
      }
    }
  }

  find(value) {
    let root = this.root;
    while (root.data !== value) {
      root.data > value ? (root = root.left) : (root = root.right);
    }
    return root;
  }

  levelOrderForEach(callback) {
    if (!callback) throw new Error("A callback is required!");

    let root = this.root;
    let queue = [];
    queue.push(root);
    while (queue.length > 0) {
      let current = queue[0];
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
      callback(current);
      queue.shift();
    }
  }

  inOrderForEach(callback) {
    if (!callback) throw new Error("A callback is required!");

    let curr = this.root;
    let stack = [];

    while (curr !== null || stack.length !== 0) {
      while (curr !== null) {
        stack.push(curr);
        curr = curr.left;
      }

      curr = stack.pop();
      callback(curr);
      curr = curr.right;
    }
  }

  preOrderForEach(callback, curr = this.root) {
    if (!callback) throw new Error("A callback is required!");

    if (curr === null) return curr;
    callback(curr);
    this.preOrderForEach(callback, curr.left);
    this.preOrderForEach(callback, curr.right);
  }

  preOrderForEach(callback, curr = this.root) {
    if (!callback) throw new Error("A callback is required!");
    if (curr === null) return curr;

    this.preOrderForEach(callback, curr.left);
    this.preOrderForEach(callback, curr.right);
    callback(curr);
  }

  depth(value) {
    let count = 0;
    let root = this.root;

    while (root.data != value) {
      console.log(root);
      root.data > value ? (root = root.left) : (root = root.right);
      if (root === null) return null;
      count += 1;
    }
    return count;
  }

  height(value) {
    let root = this.root;
    while (root.data !== value) {
      root.data > value ? (root = root.left) : (root = root.right);
      if (root === null) return null;
    }

    function countHeight(node) {
      if (node === null) return -1;

      const leftHieght = countHeight(node.left);
      const rightHeight = countHeight(node.right);

      return 1 + Math.max(leftHieght, rightHeight);
    }
    return countHeight(root);
  }

  isBalanced(root = this.root) {
    let balanced = true;

    function nodeBalanced(root) {
      if (root === null) return -1;

      const leftHieght = nodeBalanced(root.left);
      const rightHeight = nodeBalanced(root.right);

      if (Math.abs(leftHieght - rightHeight) > 1) balanced = false;
      return 1 + Math.max(leftHieght, rightHeight);
    }
    nodeBalanced(root);
    return balanced;
  }
  rebalance() {
    let root = this.root;
    let nodeList = [];
    function addNodetoList(node) {
      nodeList.push(node.data);
    }
    this.levelOrderForEach(addNodetoList);
    this.root = this.buildTree(nodeList);
  }
}

const tree = new Tree([1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324]);
console.log(tree.root);
console.log(tree.print());

tree.deleteItem(9);
tree.deleteItem(23);
console.log(tree.print());
console.log(tree.isBalanced());
console.log(tree.rebalance());
console.log(tree.print());
