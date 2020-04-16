// contains definitions for all the different lil parts of regex patterns

const items = {
  char: {
    meta: {
      name: 'character set',
      description: 'matches one or more alphanumeric characters',
    },
    output: (contents) => `${contents}`, 
    acceptsChildren: false,
  },
  lowercase_alphabet: {
    meta: {
      name: 'lowercase alphabet',
      description: 'matches lowercase letters',
      'regex preview': 'a-z',
    },
    output: () => 'a-z',
    acceptsChildren: false,
  },
  uppercase_alphabet: {
    meta: {
      name: 'uppercase alphabet',
      description: 'matches uppercase letters',
      'regex preview': 'A-Z',
    },
    output: () => 'A-Z',
    acceptsChildren: false,
  },
  plus: {
    meta: {
      name: 'plus',
      description: 'matches 1 or more characters in front of the plus',
      'regex preview': '+',
    },
    output: () => '+',
    acceptsChildren: false,
  },
  star: {
    meta: {
      name: 'star',
      description: 'matches 0 or more characters in front of the star',
      'regex preview': '*',
    },
    output: () => '*',
    acceptsChildren: false,
  },
  question_mark: {
    output: () => '?',
    acceptsChildren: false,
  },
  backslash: {
    output: () => '/',
    acceptsChildren: false,
  },
  period: {
    output: () => '.',
    acceptsChildren: false,
  },
  caret: {
    output: () => '^',
    acceptsChildren: false,
  },
  dollar_sign: {
    output: () => '$',
    acceptsChildren: false,
  },
  ampersand: {
    output: () => '&',
    acceptsChildren: false,
  },
  pipe: {
    output: () => '|',
    acceptsChildren: false,
  },
  exclamation_mark: {
    output: () => '!',
    acceptsChildren: false,
  },
  set: {
    output: (contents) => `[${contents}]`,
    acceptsChildren: true,
  },
  capture_group: {
    output: (contents) => `(${contents})`,
    acceptsChildren: true,
  },
  curly_brackets: {
    output: (contents) => `(${contents})`,
    acceptsChildren: true,
  },
};

module.exports = items;
