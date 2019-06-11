const rs = require('randomstring');

class RegexObj {
  constructor() {
    this.nodes = {};
    this.nodeList = [];
    this.nodeCount = 0;
  }

  addNode({ type, contents }) {
    // init node object
    const nodeName = `${type}_${rs.generate({ length: 8, capitalization: 'lowercase' })}`;
    const node = {
      type,
      contents,
      position: this.nodeCount,
    };
    // add node to regex object
    this.nodeList.push(nodeName);
    this.nodes[nodeName] = node;
    this.nodeCount += 1;
    // return node info
    const res = {
      position: this.nodeList.indexOf(nodeName),
      type: this.nodes[nodeName].type,
      contents: this.nodes[nodeName].contents,
    };
    return res;
  }
}

const regexObj = {
  RegexObj,
  patternRoot: 'this is the beginning of the pattern',
  patternEnd: 'this is the end of the pattern',
};

module.exports = regexObj;
