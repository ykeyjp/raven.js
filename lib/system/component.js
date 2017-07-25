const flatten = require('@ykey/util/array/flatten');
const parseTemplate = require('../parser/template');
const parseStyle = require('../parser/style');
const putNodes = require('../util/put-nodes');
const Tag = require('../component/tag');
const styleManager = require('./style');

const components = {};

/**
 * @param {string} name
 * @param {object} options
 */
function tag(name, options) {
  name = name.toLowerCase();
  if (Object.prototype.hasOwnProperty.call(components, name)) {
    throw new Error('It has already been registered.');
  }
  if (!options) {
    throw new Error('Please specify options.');
  }
  if (options.base) {
    components[name] = {
      base: options.base,
      init: options.init,
    };
    return;
  }
  const tmpl = parseTemplate(options.tmpl);
  if (options.css) {
    const scope = styleManager.generate(name);
    const rules = parseStyle(scope, options.css);
    styleManager.register(name, rules);
    if (Array.isArray(tmpl)) {
      tmpl.forEach(t => {
        if (t.name !== '#text') {
          t.attrs.static[scope] = true;
        }
      });
    } else if (tmpl) {
      tmpl.attrs.static[scope] = true;
    }
  }
  components[name] = {
    base: Tag,
    tmpl,
    init: options.init,
  };
}

/**
 * @param {string} name
 * @return {boolean}
 */
function has(name) {
  return Object.prototype.hasOwnProperty.call(components, name);
}

/**
 * @param {string} name
 * @return {object}
 */
function get(name) {
  return components[name];
}

/**
 * @param {string|HTMLElement|NodeList} target
 */
function mount(target) {
  let nodes;
  if (typeof target === 'string') {
    nodes = Array.from(document.querySelectorAll(target));
  } else if (target instanceof HTMLElement) {
    nodes = [target];
  } else if (target instanceof NodeList) {
    nodes = Array.from(target);
  }
  const targets = nodes.map(node => {
    const name = (node.getAttribute('is') || node.tagName).toLowerCase();
    if (!has(name)) {
      return null;
    }
    const info = get(name);
    const ConponentClass = info.base;
    const tag = new ConponentClass(info);
    tag.el = node;
    if (info.init instanceof Function) {
      info.init.call(tag);
    }
    return tag.render().then(nodes => {
      putNodes(node, nodes);
      return tag;
    });
  });
  return Promise.all(targets).then(c => {
    c = flatten(c).filter(Boolean);
    if (c.length === 0) {
      return null;
    } else if (c.length === 1) {
      return c[0];
    }
    return c;
  });
}

module.exports.components = components;
module.exports.tag = tag;
module.exports.has = has;
module.exports.get = get;
module.exports.mount = mount;
