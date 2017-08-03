import {flatten} from '@ykey/util';
import refs from '../component/refs';
import {IComponent, IComponentInfo} from '../types/IComponent';
import {IVNode} from '../types/IVNode';
import {ITemplateNode} from '../types/template';

export default class Virtual implements IVNode {
  public context: IComponent;
  public children: IVNode | IVNode[] = [];
  private tmpl: ITemplateNode;
  private component: IComponent | null;
  private componentInfo: IComponentInfo | null;

  constructor(component: IComponent, tmpl: ITemplateNode, info: IComponentInfo | null = null) {
    this.context = component;
    this.tmpl = tmpl;
    this.componentInfo = info;
  }

  public render(): Promise<Node | Node[]> {
    return new Promise(resolve => {
      const attrs: {[key: string]: any} = {};
      for (const key in this.tmpl.attrs.dynamic) {
        if (this.tmpl.attrs.dynamic[key] instanceof Function) {
          attrs[key] = this.tmpl.attrs.dynamic[key]!.call(this.context);
        }
      }
      if (attrs.if === false) {
        this.dispose();
        resolve([]);
        return;
      }
      const childDefer = Array.isArray(this.children)
        ? Promise.all(this.children.map(c => c.render()))
        : Promise.resolve([]);
      childDefer.then(c => {
        const children = flatten<Node>(c);
        if (!this.componentInfo) {
          resolve(children);
          return;
        }
        if (this.component) {
          this.component.$yield = children;
          this.component.update(attrs).then(nodes => {
            resolve(Array.isArray(nodes) ? flatten<Node>(nodes) : nodes);
          });
          return;
        }
        this.component = new this.componentInfo.Base(Object.assign({parent: this.context}, this.componentInfo));
        Object.assign(this.component.$, this.tmpl.attrs.static, attrs, this.tmpl.attrs.event);
        this.component.$yield = children;
        if (this.componentInfo.init instanceof Function) {
          this.componentInfo.init.call(this.component);
        }
        if (this.tmpl.attrs.static.ref) {
          refs.add(this.context, this.tmpl.attrs.static.ref, this.component);
        }
        this.component.render().then(nodes => {
          resolve(Array.isArray(nodes) ? flatten<Node>(nodes) : nodes);
        });
      });
    });
  }

  public dispose(): void {
    if (Array.isArray(this.children)) {
      this.children.forEach(c => c.dispose());
    }
    if (this.component) {
      if (this.tmpl.attrs.static.ref) {
        refs.remove(this.context, this.tmpl.attrs.static.ref, this.component);
      }
      this.component.dispose();
      this.component = null;
    }
  }
}
