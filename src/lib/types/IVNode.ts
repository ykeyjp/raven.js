import {IComponent} from './IComponent';

export interface IVNode {
  context: IComponent;
  render(): Promise<Node | Node[]>;
  dispose(): void;
}
