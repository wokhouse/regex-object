const regexObj = require('./index');

test('new RegexObj() creates RegexObj instance', () => {
  const regex = new regexObj.RegexObj();
  expect(regex.nodes).toEqual({});
  expect(regex.nodeList).toEqual([]);
  expect(regex.nodeCount).toEqual(0);
});

test('addNode() should add a node', () => {
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
  expect(node.precededBy).toEqual(regexObj.PatternRoot);
  expect(node.followedBy).toEqual(regexObj.PatternEnd);
});
