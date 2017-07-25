const componentManager = require('../system/component');
const VText = require('../vnode/v-text');
const VElement = require('../vnode/v-element');
const Looper = require('../vnode/looper');
const Virtual = require('../vnode/virtual');
const Yield = require('../vnode/yield');

function build(tmpl, component) {
  if (!tmpl) {
    return null;
  }
  if (Array.isArray(tmpl)) {
    return tmpl.map(t => build(t, component)).filter(Boolean);
  }
  if (tmpl.attrs && tmpl.attrs.dynamic && tmpl.attrs.dynamic.each) {
    return new Looper(component, tmpl);
  }
  if (tmpl.name === '#text') {
    return new VText(component, tmpl);
  }
  if (tmpl.name === 'yield') {
    return new Yield(component);
  }
  if (tmpl.name === 'virtual') {
    const virtual = new Virtual(component, tmpl);
    virtual.children = build(tmpl.children, component);
    return virtual;
  }
  const componentName = tmpl.name;
  if (componentManager.has(componentName)) {
    const info = componentManager.get(componentName);
    const virtual = new Virtual(component, tmpl, info);
    virtual.children = build(tmpl.children, component);
    return virtual;
  }
  const velement = new VElement(component, tmpl);
  velement.children = build(tmpl.children, component);
  return velement;
}

module.exports.build = build;
