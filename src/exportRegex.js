const items = require('./items');

const exportRegex = ({ nodes, nodeList }) => {
  let outputString = '';
  // iterate through nodeList
  nodeList.filter((nodeName) => {
    const node = nodes[nodeName];
    if (!node.parent) return node.name;
  }).map((nodeName) => {
    const node = nodes[nodeName];
    let nodeOutput = '';
    // if node has children, iterate through children
    if (node.children) {
      let childOutput = '';
      node.children.map((nn) => {
        const childNode = nodes[nn];
        const childNodeOutput = items[childNode.type].output(childNode.contents);
        childOutput += childNodeOutput;
      });
      nodeOutput = items[node.type].output(childOutput);
    } else {
      nodeOutput = items[node.type].output(node.contents);
    }
    outputString += nodeOutput;
  });
  // return outputString
  // TODO: output more than JS regex in terms of those letters after it
  return `/${outputString}/gm`;
};

module.exports = exportRegex;
