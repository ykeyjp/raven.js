import {IComponent} from '../types/IComponent';
import {IVNode} from '../types/IVNode';
import {ITemplateNode} from '../types/template';

export default class VText implements IVNode {
  public context: IComponent;
  public real: Text | null;
  private text: string | Function;

  constructor(component: IComponent, tmpl: ITemplateNode) {
    this.context = component;
    if (tmpl.attrs.dynamic.content) {
      this.text = tmpl.attrs.dynamic.content!;
    } else if (typeof tmpl.attrs.static.content === 'string') {
      this.text = tmpl.attrs.static.content as string;
    }
  }

  public render(): Promise<Text> {
    return new Promise(resolve => {
      if (!this.real) {
        const initialText = this.text instanceof Function ? '' : this.text;
        this.real = document.createTextNode(initialText);
      }
      if (this.text instanceof Function) {
        const text = this.text.call(this.context) as string;
        if (this.real.textContent !== text) {
          this.real.textContent = text;
        }
      }
      resolve(this.real);
    });
  }

  public dispose(): void {
    if (this.real && this.real.parentElement) {
      this.real.parentElement.removeChild(this.real);
    }
    this.real = null;
  }
}
