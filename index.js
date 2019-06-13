const rs = require('randomstring');

const unrecognizedTypeError = new Error('unrecognized type');
const canAcceptChild = ({ parent, type }) => {
  switch (parent.type) {
    case ('char'): {
      return false;
    }
    case ('set'): {
      switch (type) {
        case ('char'): {
          return true;
        }
        default: {
          throw unrecognizedTypeError;
        }
      }
    }
    default: {
      throw unrecognizedTypeError;
    }
  }
};

class RegexObj {
  constructor() {
    this.nodes = {};
    this.nodeList = [];
    this.nodeCount = 0;
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
    };
    return res;
  }

  // moveNode accepts a node name and an index to move the node to
  moveNode({ node: nodeName, index }) {
    // get node object
    const node = this.nodes[nodeName];
    // remove node from nodeList
    this.nodeList.splice(node.position, 1);
    // insert into nodeList at new index
    this.nodeList.splice(index, 0, nodeName);
    // update other node's positions
    this.nodeList.map((nn, i) => (this.nodes[nn].position = i));
  }
}

const regexObj = {
  RegexObj,
};

module.exports = regexObj;
