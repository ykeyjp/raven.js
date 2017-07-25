const env = {
  sheet: null,
  components: {},
};

/**
 * @return {CSSStyleSheet}
 */
function stylesheet() {
  if (!env.sheet) {
    const styles = Array.from(document.styleSheets).filter(
      s => s.ownerNode && s.ownerNode.getAttribute('rel') === 'raven'
    );
    if (styles.length === 0) {
      const tag = document.createElement('style');
      tag.type = 'text/css';
      document.querySelector('head').appendChild(tag);
      env.sheet = tag.sheet;
    } else {
      env.sheet = styles[0];
    }
  }
  return env.sheet;
}

/**
 * @param {string} name
 */
function generate(name) {
  return 'data-r-' + name.toLowerCase();
}

/**
 * @param {string} name
 * @param {object[]} rules
 */
function register(name, rules) {
  const selectors = [];
  rules.forEach(rule => {
    if (rule.media) {
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

/**
 * @param {string} selector
 * @param {string} rules
 */
function insertRules(selector, rules) {
  const sheet = stylesheet();
  sheet.insertRule(selector + '{' + rules + '}', sheet.cssRules.length);
}

/**
 * @param {string} name
 */
function unregister(name) {
  if (
    Object.prototype.hasOwnProperty.call(env.components, name) &&
    Array.isArray(env.components[name])
  ) {
    const sheet = stylesheet();
    const selectors = env.components[name];
    Array.from(sheet.cssRules).forEach((rule, i) => {
      if (
        rule instanceof CSSStyleRule &&
        selectors.indexOf(rule.selectorText) !== -1
      ) {
        sheet.deleteRule(i);
      } else if (rule instanceof CSSMediaRule) {
        const result = Array.from(rule.cssRules)
          .map(rule => selectors.indexOf(rule.selectorText) !== -1)
          .filter(Boolean);
        if (result.length > 0) {
          sheet.deleteRule(i);
        }
      }
    });
  }
}

module.exports.env = env;
module.exports.stylesheet = stylesheet;
module.exports.generate = generate;
module.exports.register = register;
module.exports.unregister = unregister;
