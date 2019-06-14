// contains definitions for all the different lil parts of regex patterns

const items = {
  char: {
    output: (contents) => `${contents}`, 
    acceptsChildren: false,
  },
  lowercase_alphabet: {
    output: () => 'a-z',
    acceptsChildren: false,
  },
  uppercase_alphabet: {
    output: () => 'A-Z',
    acceptsChildren: false,
  },
  plus: {
    output: () => '+',
    acceptsChildren: false,
  },
  star: {
    output: () => '*',
    acceptsChildren: false,
  },
  set: {
    output: (contents) => `[${contents}]`,
    acceptsChildren: true,
  },
};

module.exports = items;
