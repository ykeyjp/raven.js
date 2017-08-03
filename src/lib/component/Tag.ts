import {flatten, SimpleEvent} from '@ykey/util';
import mixin from '../system/mixin';
import {IComponent, IComponentInfo, IComponentOptions} from '../types/IComponent';
import {IVNode} from '../types/IVNode';
import factory from '../vnode/factory';

interface ITagOptions {
  isMounted: boolean;
}

export default class Tag implements IComponent {
  public parent?: IComponent;
  public $: {[key: string]: any};
  public refs: {[key: string]: IComponent | Node | Array<IComponent | Node>};
  public $yield: Node[];
  public event: SimpleEvent;
  private vnode: IVNode | IVNode[];
  private _: ITagOptions;

  constructor(options: IComponentOptions & IComponentInfo) {
    this.parent = options.parent;
    if (options.tmpl) {
      this.vnode = factory.build(options.tmpl, this);
    }
    this.event = new SimpleEvent();
    this.$ = {};
    this.refs = {};
    this._ = {
      isMounted: false,
    };
  }

  public update($?: {[key: string]: any}): Promise<Node | Node[]> {
    Object.assign(this.$, $);
    return this.render();
  }

  public render(): Promise<Node | Node[]> {
    return new Promise(resolve => {
      let nodes: Promise<Node | Node[]>;
      if (Array.isArray(this.vnode)) {
        const defers = this.vnode.map(vnode => vnode.render()).filter(Boolean);
        nodes = Promise.all(defers).then(n => flatten<Node>(n));
      } else {
        nodes = this.vnode.render();
      }
      nodes.then(node => {
        resolve(node);
        if (this._.isMounted) {
          this.event.trigger('update');
        } else {
          this._.isMounted = true;
          this.event.trigger('mount');
        }
      });
    });
  }

  public mixin(name: string): void {
    mixin.apply(this, name);
  }

  public dispose(): void {
    this.event.trigger('unmount');
    this.event.reset();
    if (Array.isArray(this.vnode)) {
      this.vnode.forEach(vnode => vnode.dispose());
    } else {
      this.vnode.dispose();
    }
    delete this.parent;
  }
}
