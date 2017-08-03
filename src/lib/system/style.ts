import {IMixedStyle, IStyleMediaRule, IStyleRule} from '../types/template';

const env: {components: any; sheet: CSSStyleSheet | null} = {
  components: {},
  sheet: null,
};

function stylesheet(): CSSStyleSheet {
  if (!env.sheet) {
    const styles = Array.from(document.styleSheets).filter(
      s => s.ownerNode && (s.ownerNode as HTMLStyleElement).getAttribute('rel') === 'raven'
    );
    if (styles.length === 0) {
      const tag = document.createElement('style');
      tag.type = 'text/css';
      document.querySelector('head')!.appendChild(tag);
      env.sheet = tag.sheet as CSSStyleSheet;
    } else {
      env.sheet = styles[0] as CSSStyleSheet;
    }
  }
  return env.sheet;
}

function generate(name: string): string {
  return 'data-r-' + name.toLowerCase();
}

function register(name: string, rules: IMixedStyle[]): void {
  const selectors: string[] = [];
  rules.forEach(rule => {
    if (rule.type === 'media') {
      const rules = rule.selectors
        .map(rule => {
          selectors.push(rule.selector);
          return rule.selector + '{' + rule.rules + '}';
        })
        .join('');
      insertRules('@media ' + rule.media, rules);
    } else {
      insertRules(rule.selector, rule.rules);
      selectors.push(rule.selector);
    }
  });
  env.components[name] = selectors;
}

function insertRules(selector: string, rules: string): void {
  const sheet = stylesheet();
  sheet.insertRule(selector + '{' + rules + '}', sheet.cssRules.length);
}

function unregister(name: string): void {
  if (Object.prototype.hasOwnProperty.call(env.components, name) && Array.isArray(env.components[name])) {
    const sheet = stylesheet();
    const selectors = env.components[name];
    Array.from(sheet.cssRules).forEach((rule, i) => {
      if (rule instanceof CSSStyleRule && selectors.indexOf(rule.selectorText) !== -1) {
        sheet.deleteRule(i);
      } else if (rule instanceof CSSMediaRule) {
        const result = Array.from(rule.cssRules)
          .map((rule: CSSStyleRule) => selectors.indexOf(rule.selectorText) !== -1)
          .filter(Boolean);
        if (result.length > 0) {
          sheet.deleteRule(i);
        }
      }
    });
  }
}

export default {
  env,
  generate,
  register,
  stylesheet,
  unregister,
};
