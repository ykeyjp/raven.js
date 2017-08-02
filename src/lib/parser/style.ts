import {IMixedStyle, IStyleMediaRule, IStyleRule} from '../types/template';

const commentExpr = /\/\*[^*]*\*+([^/*][^*]*\*+)*\//g;
const selectorExpr = /([^{]+)\{([\s\S]*?)}/g;
const mediaExpr = /@media([^{]+)\{([\s\S]*?})\s*}/g;

export default function style(scope: string, src: string): IMixedStyle[] {
  commentExpr.lastIndex = 0;
  selectorExpr.lastIndex = 0;
  mediaExpr.lastIndex = 0;
  src = src.trim().replace(commentExpr, '');
  const sets: IMixedStyle[] = [];
  const result = src
    .replace(mediaExpr, ($0, media: string, selectors: string) => {
      const mediaSet: IStyleMediaRule = {
        media: media.trim(),
        selectors: [],
        type: 'media',
      };
      const result = selectors.replace(selectorExpr, ($0, selector, rules) => {
        mediaSet.selectors.push({
          rules: rules.trim(),
          selector: replaceScope(scope, selector.trim()),
          type: 'rule',
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
        rules: rules.trim(),
        selector: replaceScope(scope, selector.trim()),
        type: 'rule',
      });
      return '';
    });
  if (result.trim().length > 0) {
    throw new Error('It is not fully parsed.');
  }
  return sets;
}

const scopeExpr = /:root\b/g;

function replaceScope(scope: string, selector: string): string {
  scopeExpr.lastIndex = 0;
  if (scopeExpr.test(selector)) {
    scopeExpr.lastIndex = 0;
    return selector.replace(scopeExpr, '[' + scope + '] ').trim();
  }
  return '[' + scope + '] ' + selector;
}
