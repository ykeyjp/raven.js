import * as refs from '../component/refs';
import {IComponent} from '../types/IComponent';
import {IVNode} from '../types/IVNode';
import {ITemplateNode} from '../types/template';
import putNodes from '../util/putNodes';

export default class VElement implements IVNode {
  public context: IComponent;
  public children: IVNode | IVNode[] = [];
  public real: Element | null;
  private tmpl: ITemplateNode;
  private cache: any;

  constructor(component: IComponent, tmpl: ITemplateNode) {
    this.context = component;
    this.tmpl = tmpl;
    this.cache = {};
  }

  public render(): Promise<Element | Node[]> {
    return new Promise(resolve => {
      const attrs: {[key: string]: any} = {};
      for (const key in this.tmpl.attrs.dynamic) {
        if (this.tmpl.attrs.dynamic[key] instanceof Function) {
          attrs[key] = this.tmpl.attrs.dynamic[key]!.call(this.context);
        }
      }
      if (attrs.if === false) {
        this.dispose();
      } else if (this.real) {
        for (const key in attrs) {
          if (this.cache[key] !== attrs[key]) {
            this.real!.setAttribute(key, attrs[key]);
          }
        }
      } else {
        this.real = document.createElement(this.tmpl.name);
        for (const key in this.tmpl.attrs.static) {
          if (Object.prototype.hasOwnProperty.call(this.tmpl.attrs.static, key)) {
            this.real.setAttribute(key, this.tmpl.attrs.static[key] as string);
          }
        }
        for (const key in attrs) {
          if (this.cache[key] !== attrs[key]) {
            this.real!.setAttribute(key, attrs[key]);
          }
        }
        for (const key in this.tmpl.attrs.event) {
          if (this.tmpl.attrs.event[key] instanceof Function) {
            this.real.addEventListener(key, this.tmpl.attrs.event[key]);
          }
        }
        if (this.tmpl.attrs.static.ref) {
          refs.add(this.context, this.tmpl.attrs.static.ref, this.real);
        }
      }
      this.cache = attrs;
      const el = this.real;
      if (el) {
        const childrenDefer = Array.isArray(this.children)
          ? Promise.all(this.children.map(c => c.render()))
          : Promise.resolve([]);
        childrenDefer.then(children => {
          putNodes(el, children);
          resolve(el);
        });
      } else {
        resolve([]);
      }
    });
  }

  public dispose(): void {
    if (this.real && this.tmpl.attrs.static.ref) {
      refs.remove(this.context, this.tmpl.attrs.static.ref, this.real);
    }
    if (this.real && this.real.parentElement) {
      this.real.parentElement.removeChild(this.real);
    }
    this.real = null;
    if (Array.isArray(this.children)) {
      this.children.forEach(c => c.dispose());
    }
  }
}
