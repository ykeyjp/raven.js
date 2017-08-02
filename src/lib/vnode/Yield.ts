import {IComponent} from '../types/IComponent';
import {IVNode} from '../types/IVNode';

export default class Yield implements IVNode {
  public context: IComponent;

  constructor(component: IComponent) {
    this.context = component;
  }

  public render(): Promise<Node | Node[]> {
    return Promise.resolve(this.context.$yield || []);
  }

  public dispose(): void {}
}
