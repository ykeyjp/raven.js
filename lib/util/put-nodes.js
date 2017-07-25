const flatten = require('@ykey/util/array/flatten');

/**
 * @param {Node} parent
 * @param {Node|Array<Node>} children
 */
function putNodes(parent, children) {
  if (!parent || !children) {
    return;
  }
  if (Array.isArray(children)) {
    flatten(children).filter(Boolean).forEach((child, i) => {
      if (parent !== child.parentNode || parent.childNodes[i] !== child) {
        parent.insertBefore(child, parent.childNodes[i]);
      }
    });
  } else if (parent !== children.parentNode) {
    parent.appendChild(children);
  }
}

module.exports = putNodes;
