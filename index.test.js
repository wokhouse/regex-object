const regexObj = require('./index');

test('new RegexObj() creates RegexObj instance', () => {
  const regex = new regexObj.RegexObj();
  expect(regex.nodes).toEqual({});
  expect(regex.nodeList).toEqual([]);
  expect(regex.nodeCount).toEqual(0);
});

test('addNode() should add a character node', () => {
  const regex = new regexObj.RegexObj();
  const node = regex.addNode({
    type: 'char',
    contents: 'a',
  });

  // check to see if node was added to nodeList and nodes object
  const charName = expect.stringMatching(/char_[a-z0-9]{8}/);
  expect(regex.nodeList).toEqual(expect.arrayContaining([charName]));
  expect(Object.keys(regex.nodes)).toEqual(expect.arrayContaining([charName]));
  expect(regex.nodeCount).toEqual(1);

  // check through returned node object
  expect(node.position).toEqual(0);
  expect(node.type).toEqual('char');
  expect(node.contents).toEqual('a');
  expect(node.name).toEqual(regex.nodeList[0]);
});

// child validity testing, tests canAcceptChild function
test('addNode() should not allow adding char node to char nodes children', () => {
  const regex = new regexObj.RegexObj();
  const charNode1 = regex.addNode({
    type: 'char',
    contents: 'c',
  });
  expect(() => regex.addNode({
    type: 'char',
    contents: 'd',
    parent: charNode1.name,
  })).toThrow('cannot set char as child of char');
});

// adding a character as a child to a set
test('addNode() should add a set with a character in it', () => {
  const regex = new regexObj.RegexObj();
  const setNode = regex.addNode({
    type: 'set',
  });
  const charNode = regex.addNode({
    type: 'char',
    contents: 'b',
    parent: setNode.name,
  });
  expect(charNode.parent).toEqual(setNode.name);
  expect(regex.nodes[setNode.name].children).toEqual([charNode.name]);
});
