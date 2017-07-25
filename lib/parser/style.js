const commentExpr = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
const selectorExpr = /([^{]+)\{([\s\S]*?)}/g;
const mediaExpr = /@media([^{]+)\{([\s\S]*?})\s*}/g;

/**
 * @param {string} scope
 * @param {string} src
 * @return {object[]}
 */
function style(scope, src) {
  commentExpr.lastIndex = 0;
  selectorExpr.lastIndex = 0;
  mediaExpr.lastIndex = 0;
  src = src.trim().replace(commentExpr, '');
  const sets = [];
  const result = src
    .replace(mediaExpr, ($0, media, selectors) => {
      const mediaSet = {
        media: media.trim(),
        selectors: [],
      };
      const result = selectors.replace(selectorExpr, ($0, selector, rules) => {
        mediaSet.selectors.push({
          selector: replaceScope(scope, selector.trim()),
          rules: rules.trim(),
        });
        return '';
      });
      if (result.trim().length > 0) {
        throw new Error('It is not fully parsed.');
      }
      sets.push(mediaSet);
      return '';
    })
    .replace(selectorExpr, ($0, selector, rules) => {
      sets.push({
        selector: replaceScope(scope, selector.trim()),
        rules: rules.trim(),
      });
      return '';
    });
  if (result.trim().length > 0) {
    throw new Error('It is not fully parsed.');
  }
  return sets;
}

const scopeExpr = /:root\b/g;

/**
 * @param {string} scope
 * @param {string} selector
 * @return {string}
 */
function replaceScope(scope, selector) {
  scopeExpr.lastIndex = 0;
  if (scopeExpr.test(selector)) {
    scopeExpr.lastIndex = 0;
    return selector.replace(scopeExpr, '[' + scope + '] ').trim();
  }
  return '[' + scope + '] ' + selector;
}

module.exports = style;
