import {ITemplateNode} from './template';

export interface IComponent {
  [key: string]: any;
  parent?: IComponent;
  $: {[key: string]: any};
  refs: {[key: string]: IComponent | Node | Array<IComponent | Node>};
  $yield: Node | Node[];
  update($?: {[key: string]: any}): Promise<Node | Node[]>;
  render(): Promise<Node | Node[]>;
  dispose(): void;
}

export interface IComponentConstructor {
  new (options: IComponentOptions & IComponentInfo): IComponent;
}

export interface IComponentInfo {
  Base: IComponentConstructor;
  init?: Function | null;
  tmpl?: ITemplateNode | ITemplateNode[];
}

export interface IComponentOptions {
  parent?: IComponent;
}
