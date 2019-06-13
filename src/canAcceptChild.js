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

module.exports = canAcceptChild;
