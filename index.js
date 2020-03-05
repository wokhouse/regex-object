const rs = require('randomstring');
const canAcceptChild = require('./src/canAcceptChild');
const exportRegex = require('./src/exportRegex.js');
const items = require('./src/items.js');

class RegexObj {
  constructor(nodes = {}, nodeList = [], nodeCount = 0) {
    this.nodes = nodes;
    this.nodeList = nodeList;
    this.nodeCount = nodeCount;
  }

  // addNode will insert a new regex part into the class' data
  // structures
  addNode({ type, contents, parent }) {
    // init node object
    const nodeName = `${type}_${rs.generate({ length: 8, capitalization: 'lowercase' })}`;
    const node = {
      type,
      name: nodeName,
      contents,
      position: this.nodeCount,
    };
    if (type === 'set') node.children = [];
    if (parent) {
      const parentNode = this.nodes[parent];
      // if parent arg specified, check to see if parent node
      // can accept children
      const validChild = canAcceptChild({
        parent: parentNode,
        type,
      });
      if (validChild === false) throw new Error(`cannot set ${type} as child of ${parentNode.type}`);
      // if parent can accept node as child, modify both
      node.parent = parent;
      if (!parentNode.children) parentNode.children = [];
      parentNode.children.push(nodeName);
    }
    // add node to regex object
    this.nodeList.push(nodeName);
    this.nodes[nodeName] = node;
    this.nodeCount += 1;
    // return node info
    const res = {
      name: nodeName,
      position: this.nodeList.indexOf(nodeName),
      type: this.nodes[nodeName].type,
      contents: this.nodes[nodeName].contents,
      parent: this.nodes[nodeName].parent,
      children: this.nodes[nodeName].children,
    };
    return res;
  }

  // moveNode accepts a node name and an index to move the node to
  moveNode({
    node: nodeName,
    index,
    addToParent,
    removeFromParent,
  }) {
    // get node object
    const node = this.nodes[nodeName];
    // remove node from nodeList
    this.nodeList.splice(node.position, 1);

    // check if are we moving things in or out of parents
    if (removeFromParent) {
      const parentNode = this.nodes[node.parent];
      // get children list
      const children = parentNode.children;
      // get parentNode position
      const parentPosition = parentNode.position;
      // subtract parent position from node position to get position
      // in children list
      const relativeChildPosition = node.position - parentPosition;
      // remove child from list
      parentNode.children.splice(relativeChildPosition - 1, 1);
      // clear parent field from node
      node.parent = undefined;
      // set index to place node at end of old parent
      index = parentPosition + parentNode.children.length + 1;
    }
    if (addToParent) {
      // TODO: fix limitation where we can only move nodes to
      // the end of the parent's children
      const parentNode = this.nodes[addToParent];
      const parentIndex = parentNode.position;
      const parentChildCount = parentNode.children.length;
      const lastChildIndex = parentIndex + parentChildCount;
      index = lastChildIndex + 1;
      // we need to update this node's parent field and add this 
      // to the parent's children field
      parentNode.children.push(nodeName);
      node.parent = parentNode.name;
    }
   
    // insert into nodeList at new index
    this.nodeList.splice(index, 0, nodeName);
    // update other node's positions
    this.nodeList.map((nn, i) => (this.nodes[nn].position = i));
  }

  deleteNode({ node: nodeName }) {
    const node = this.nodes[nodeName];
    if (node && node.children) {
      const children = node.children;
      children.map((c) => {
        this.deleteNode({ node: c });
      });
    }
    // if the node is a child node of a parent, delete the node from the parent node
    if (node && node.parent) {
      this.nodes[node.parent].children = this.nodes[node.parent]
        .children.filter(n => n !== nodeName);
    }
    // remove node from node object
    delete this.nodes[nodeName];
    // remove node from nodeList
    this.nodeList = this.nodeList.filter(n => n !== nodeName);
    // refactor node positions with new structure of the parent node
    this.nodeList.map((n, i) => this.nodes[n].position = i);
    // update nodeCount
    this.nodeCount -= 1;
  }

  exportRegex() {
    const output = exportRegex({
      nodes: this.nodes,
      nodeList: this.nodeList,
    });
    return output;
  }
}

const regexObj = {
  RegexObj,
  items,
};

module.exports = regexObj;
