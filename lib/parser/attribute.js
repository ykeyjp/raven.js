const wrapExpr = require('./wrap');

const flagExpr = /([-:@a-zA-Z0-9]+)\s*(?!=)/g;
const attrExpr = /([-:@a-zA-Z0-9]+)\s*=(["'])(.*?[^\\]){0,1}\2\s*/g;

/**
 * @param {string} src
 * @return {object}
 */
function attribute(src) {
  const attrs = {static: {}, dynamic: {}, event: {}};
  const result = src
    .trim()
    .replace(attrExpr, ($0, name, quote, value) => {
      value = value
        ? cast(value.replace(new RegExp('\\\\' + quote, 'g'), quote))
        : null;
      if (name[0] === ':') {
        attrs.dynamic[name.substr(1)] = createAttributeFunction(value);
      } else if (name[0] === '@') {
        attrs.event[name.substr(1)] = createEventFunction(value);
      } else {
        attrs.static[name] = value;
      }
      return '';
    })
    .replace(flagExpr, (_, name) => {
      attrs.static[name] = true;
      return '';
    })
    .trim();
  if (result.length > 0) {
    throw new Error('It is not fully parsed.');
  }
  return attrs;
}

/**
 * @param {string} val
 * @return {string|number|boolean|null|undefined}
 */
function cast(val) {
  const str = val.toLowerCase();
  if (str === 'true') {
    return true;
  } else if (str === 'false') {
    return false;
  } else if (str === 'null') {
    return null;
  } else if (str === 'undefined') {
    return undefined;
  } else if (/^[1-9]?[0-9]+$/.test(str)) {
    return parseInt(str, 10);
  } else if (/^[1-9]?[0-9]+\.[0-9]+$/.test(str)) {
    return parseFloat(str);
  }
  return val;
}

function createAttributeFunction(src) {
  return Function('return ' + wrapExpr(src));
}

function createEventFunction(src) {
  const handler =
    'try { e.$$ = this.$$; ' +
    wrapExpr(src) +
    '.call(this, e); if (!e.skipUpdate) { this.update(); } } catch (err) {}';
  return Function('e', handler);
}

module.exports = attribute;
