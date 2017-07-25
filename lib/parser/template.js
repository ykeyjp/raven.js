const parseAttribute = require('./attribute');
const parseText = require('./text');

const tagExpr = /<([-:a-zA-Z0-9]+)(\b[^>]*)>([\s\S]*?)<\/\1>/gm;
const tag2Expr = /<([-:a-zA-Z0-9]+)(\b[^>]*?)[/]{0,1}>/gm;
const partExpr = /^__[0-9]+__$/;
const seperator = '{=}';

/**
 * @param {string} html
 */
function template(html, forceMulti = false) {
  tagExpr.lastIndex = 0;
  tag2Expr.lastIndex = 0;
  const tags = {};
  let position = 0;
  const result = html
    .replace(tagExpr, (all, tag, attrs, inner) => {
      const p = position++;
      tags['t' + p] = {
        name: tag,
        attrs: parseAttribute(attrs.trim()),
        children: template(inner, true),
      };
      return seperator + '__' + p + '__' + seperator;
    })
    .replace(tag2Expr, (all, tag, attrs) => {
      const p = position++;
      tags['t' + p] = {
        name: tag,
        attrs: parseAttribute(attrs.trim()),
        children: [],
      };
      return seperator + '__' + p + '__' + seperator;
    });
  const nodes = result
    .split('{=}')
    .map(part => {
      part = part.trim();
      if (part.length === 0) {
        return null;
      }
      partExpr.lastIndex = 0;
      if (partExpr.test(part)) {
        return tags['t' + part.substr(2, part.length - 4)];
      }
      const parsedText = parseText(part);
      const textAttrs = {};
      if (parsedText instanceof Function) {
        textAttrs.dynamic = {content: parsedText};
      } else {
        textAttrs.static = {content: parsedText};
      }
      return {
        name: '#text',
        attrs: textAttrs,
      };
    })
    .filter(Boolean);
  if (!forceMulti && nodes.length === 1) {
    return nodes[0];
  }
  return nodes;
}

module.exports = template;
