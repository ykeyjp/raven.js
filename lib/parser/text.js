const wrapExpr = require('./wrap');

const tmplExpr = /\{\{([\s\S]+?)\}\}/g;

/**
 * @param {string} text
 * @return {string|Function}
 */
function text(text) {
  tmplExpr.lastIndex = 0;
  if (!tmplExpr.test(text)) {
    return text;
  }
  const parts = [];
  let m;
  let pindex = 0;
  tmplExpr.lastIndex = 0;
  while ((m = tmplExpr.exec(text))) {
    parts.push("'" + escapeText(text.slice(pindex, m.index)) + "'");
    parts.push('(function(){return ' + wrapExpr(m[1]) + ';}).call(this)');
    pindex += m.index + m[0].length;
  }
  if (pindex < text.length) {
    parts.push("'" + escapeText(text.slice(pindex, text.length)) + "'");
  }
  return Function('return "".concat(' + parts.join(',') + ');');
}

/**
 * @param {string} text
 */
function escapeText(text) {
  return text.replace(/'/g, "\\'").replace(/\r?\n/g, '\\n');
}

module.exports = text;
