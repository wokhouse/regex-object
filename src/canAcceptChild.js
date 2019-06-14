const items = require('./items');

const unrecognizedTypeError = new Error('unrecognized type');

const canAcceptChild = ({ parent }) => {
  // if unrecognized item, throw error
  if (items[parent.type] === undefined) {
    throw unrecognizedTypeError; 
  } 
  // if item does not accept children, return false
  if (items[parent.type].acceptsChildren === false) {
    return false;
  }
  // otherwise, item should accept children. return true
  return true;
};

module.exports = canAcceptChild;
