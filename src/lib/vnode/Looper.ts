import {clone, flatten} from '@ykey/util';
import {IComponent} from '../types/IComponent';
import {IVNode} from '../types/IVNode';
import {ITemplateNode} from '../types/template';
import factory from './factory';

interface IItemObject {
  key: string | number;
  item: any;
}

export default class Looper implements IVNode {
  public context: IComponent;
  private generator: Function;
  private nodeCache: Node[];
  private itemCache: string;
  private vnodes: IVNode[];
  private tmpl: ITemplateNode;

  constructor(component: IComponent, tmpl: ITemplateNode) {
    this.context = component;
    tmpl = clone(tmpl);
    if (tmpl.attrs.dynamic.each instanceof Function) {
      this.generator = tmpl.attrs.dynamic.each;
      delete tmpl.attrs.dynamic.each;
    }
    this.nodeCache = [];
    this.itemCache = '';
    this.vnodes = [];
    this.tmpl = tmpl;
  }

  public render(): Promise<Node | Node[]> {
    const list = this.generator.call(this.context);
    let items: IItemObject[];
    if (Array.isArray(list)) {
      items = list.map((v, i) => ({key: i, item: v}));
    } else {
      items = Object.keys(list).map(k => ({key: k, item: list[k]}));
    }
    const item$json = JSON.stringify(items);
    if (this.itemCache === item$json) {
      return Promise.resolve(this.nodeCache);
    }
    if (this.vnodes.length < items.length) {
      for (let i = this.vnodes.length, l = items.length; i < l; ++i) {
        const proto = Object.create(Object.getPrototypeOf(this.context));
        const context = Object.assign(proto, this.context);
        this.vnodes.push(factory.build(this.tmpl, context) as IVNode);
      }
    } else if (this.vnodes.length > items.length) {
      for (let i = items.length, l = this.vnodes.length; i < l; ++i) {
        this.vnodes[i].dispose();
      }
      this.vnodes.length = items.length;
    }
    return Promise.all(
      this.vnodes.map((vnode, i) => {
        Object.assign(vnode.context, this.context, {$$: items[i]});
        return vnode.render();
      })
    ).then(n => {
      const nodes = flatten<Node>(n);
      this.nodeCache = nodes;
      this.itemCache = item$json;
      return nodes;
    });
  }

  public dispose(): void {
    this.vnodes.forEach(vnode => vnode.dispose());
    this.nodeCache = [];
    this.itemCache = '';
    this.vnodes = [];
  }
}
