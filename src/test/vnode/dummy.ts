import {IComponent} from '../../lib/types/IComponent';

export class DummyComponent {
  [key: string]: any;
  public $: {[key: string]: any} = {};
  public refs: {[key: string]: IComponent | Node | Array<IComponent | Node>} = {};
  public $yield: Node | Node[] = [];
  public update($?: {[key: string]: any}): Promise<Node | Node[]> {
    return Promise.resolve([]);
  }
  public render(): Promise<Node | Node[]> {
    return Promise.resolve([]);
  }
  public dispose(): void {}
}
