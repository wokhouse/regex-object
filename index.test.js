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

// new set nodes should have empty children array in it
test('addNode() new sets should have empty children array', () => {
  const regex = new regexObj.RegexObj();
  const setNode = regex.addNode({
    type: 'set',
  });
  expect(regex.nodes[setNode.name].children).toEqual([]);
});

test('moveNode() should move nodes', () => {
  const regex = new regexObj.RegexObj();
  const charNode1 = regex.addNode({
    type: 'char',
    contents: 'd',
  });
  const charNode2 = regex.addNode({
    type: 'char',
    contents: 'o',
  });
  const charNode3 = regex.addNode({
    type: 'char',
    contents: 'g',
  });
  // rearrange "dog" to spell "god"
  regex.moveNode({
    node: charNode1.name,
    index: 2,
  });
  regex.moveNode({
    node: charNode3.name,
    index: 0,
  });
  expect(regex.nodeList).toEqual([charNode3.name, charNode2.name, charNode1.name]);
  expect(regex.nodes[charNode1.name].position).toEqual(2);
  expect(regex.nodes[charNode2.name].position).toEqual(1);
  expect(regex.nodes[charNode3.name].position).toEqual(0);
});

test('moveNode() should move nodes into parents', () => {
  const regex = new regexObj.RegexObj();
  const setNode = regex.addNode({
    type: 'set',
  });
  const charNode1 = regex.addNode({
    type: 'char',
    contents: 'h',
    parent: setNode.name,
  });
  const charNode2 = regex.addNode({
    type: 'char',
    contents: 'i',
  });
  const charNode3 = regex.addNode({
    type: 'char',
    contents: 'j',
  });
  // By using the addToParent option,  will add node to the set
  // after the other children in the set
  regex.moveNode({
    node: charNode3.name,
    addToParent: setNode.name,
  });
  expect(regex.nodes[setNode.name].children).toEqual([charNode1.name, charNode3.name]);
  expect(regex.nodeList).toEqual([setNode.name, charNode1.name, charNode3.name, charNode2.name]);
});

test('moveNode() should move nodes out of parents', () => {
  const regex = new regexObj.RegexObj();
  const setNode = regex.addNode({
    type: 'set',
  });
  const charNode1 = regex.addNode({
    type: 'char',
    contents: 'h',
    parent: setNode.name,
  });
  const charNode2 = regex.addNode({
    type: 'char',
    contents: 'i',
    parent: setNode.name
  });
  // removeFromParent will put child right after the parent's last node
  regex.moveNode({
    node: charNode1.name,
    removeFromParent: true,
  });
  expect(regex.nodes[setNode.name].children).toEqual([charNode2.name]);
  expect(regex.nodeList).toEqual([setNode.name, charNode2.name, charNode1.name]);
});

test.todo('moveNode() should move nodes within parents');

test.todo('moveNode() should move nodes between parents');

test.todo('moveNode() should move nodes out of parent and then to a specified index');

test('exportRegex() should output a valid regex string', () => {
  const regex = new regexObj.RegexObj();
  const setNode = regex.addNode({
    type: 'set',
  });
  const charNode1 = regex.addNode({
    type: 'lowercase_alphabet',
    parent: setNode.name,
  });
  const modNode1 = regex.addNode({
    type: 'plus',
  });
  const output = regex.exportRegex();
  expect(output).toEqual('[a-z]+');
});

test('deleteNode() should delete the node', () => {
  const regex = new regexObj.RegexObj();
  const charNode = regex.addNode({
    type: 'char',
    contents: 'testhaha',
  });
  regex.deleteNode({ node: charNode.name });
  expect(regex.nodes).toEqual({});
  expect(regex.nodeList).toEqual([]);
});

test('deleteNode() should delete the node and remove the node from its parents children array', () => {
  const regex = new regexObj.RegexObj();
  const setNode = regex.addNode({
    type: 'set',
  });
  const charNode = regex.addNode({
    type: 'char',
    contents: 'test',
    parent: setNode.name,
  });
  regex.deleteNode({ node: charNode.name});
  const testObj = {};
  testObj[setNode.name] = { ...regex.nodes[setNode.name] };
  expect(regex.nodes[setNode.name].children).toEqual([]);
  expect(regex.nodes).toEqual(testObj);
});

test('deteNode() should delete the children object as well when the parent node is deleted', () => {
  const regex = new regexObj.RegexObj();
  const setNode = regex.addNode({
    type: 'set',
  });
  const charNode = regex.addNode({
    type: 'char',
    contents: 'test',
    parent: setNode.name,
  });
  regex.deleteNode({ node: setNode.name });
  expect(regex.nodes).toEqual({});
  expect(regex.nodeList).toEqual([]);
});

test('deleteNode() should update all node positions', () => {
  const regex = new regexObj.RegexObj();
  const charNode = regex.addNode({
    type: 'char',
    contents: 'test',
  });
  regex.addNode({
    type: 'char',
    contents: 'foo',
  });
  regex.addNode({
    type: 'char',
    contents: 'bar',
  });
  regex.deleteNode({ node: charNode.name });
  // iterate through nodeList, check to see that
  // node position matches its index in the list
  regex.nodeList.map((n, i) => {
    expect(regex.nodes[n].position).toEqual(i);
  });
});

test('deleteNode() should nodeCount', () => {
  const regex = new regexObj.RegexObj();
  const node1 = regex.addNode({
    type: 'char',
    contents: 'test',
  });
  const node2 = regex.addNode({
    type: 'char',
    contents: 'foo',
  });
  const node3 = regex.addNode({
    type: 'char',
    contents: 'bar',
  });
  regex.deleteNode({ node: node1.name });
  // check nodeCount
  expect(regex.nodeCount).toEqual(2);
  expect(regex.nodeList).toEqual([ node2.name, node3.name ]);
});
