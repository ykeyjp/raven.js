import componentManager from '../system/component';
import {IComponent} from '../types/IComponent';
import {IVNode} from '../types/IVNode';
import {ITemplateNode} from '../types/template';
import Looper from './Looper';
import VElement from './VElement';
import Virtual from './Virtual';
import VText from './VText';
import Yield from './Yield';

function build(tmpl: ITemplateNode | ITemplateNode[], component: IComponent): IVNode | IVNode[] {
  if (!tmpl) {
    return [];
  }
  if (Array.isArray(tmpl)) {
    return tmpl.map(t => build(t, component)).filter(Boolean) as IVNode[];
  }
  if (tmpl.attrs.dynamic.each) {
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
    if (tmpl.children) {
      virtual.children = build(tmpl.children, component);
    }
    return virtual;
  }
  const componentName = tmpl.name;
  if (componentManager.has(componentName)) {
    const info = componentManager.get(componentName);
    const virtual = new Virtual(component, tmpl, info);
    if (tmpl.children) {
      virtual.children = build(tmpl.children, component);
    }
    return virtual;
  }
  const velement = new VElement(component, tmpl);
  if (tmpl.children) {
    velement.children = build(tmpl.children, component);
  }
  return velement;
}

export default {build};
