import flatten from '@ykey/util/lib/array/flatten';
import Tag from '../component/Tag';
import parseStyle from '../parser/style';
import parseTemplate from '../parser/template';
import {IComponent, IComponentConstructor, IComponentInfo, IComponentOptions} from '../types/IComponent';
import {ITemplateNode} from '../types/template';
import putNodes from '../util/putNodes';
import * as styleManager from './style';

export interface ITagOptions {
  Base?: IComponentConstructor;
  init?: null | Function;
  tmpl?: string;
  css?: string;
}

export const components: {[key: string]: IComponentInfo} = {};

export function tag(name: string, options: ITagOptions): void {
  name = name.toLowerCase();
  if (Object.prototype.hasOwnProperty.call(components, name)) {
    throw new Error('It has already been registered.');
  }
  if (options.Base) {
    components[name] = {
      Base: options.Base,
      init: options.init,
    };
    return;
  }
  const tmpl = parseTemplate(options.tmpl || '');
  if (options.css) {
    const scope = styleManager.generate(name);
    const rules = parseStyle(scope, options.css);
    styleManager.register(name, rules);
    if (Array.isArray(tmpl)) {
      tmpl.forEach(t => {
        if (t.name !== '#text') {
          t.attrs.static[scope] = true;
        }
      });
    } else if (tmpl) {
      tmpl.attrs.static[scope] = true;
    }
  }
  components[name] = {
    Base: Tag,
    init: options.init,
    tmpl,
  };
}

export function has(name: string): boolean {
  return Object.prototype.hasOwnProperty.call(components, name);
}

export function get(name: string): IComponentInfo {
  return components[name];
}

export function mount(target: string | Element | NodeListOf<Element>): Promise<IComponent | IComponent[]> {
  let nodes: Element[];
  if (typeof target === 'string') {
    nodes = Array.from(document.querySelectorAll(target));
  } else if (target instanceof HTMLElement) {
    nodes = [target];
  } else if (target instanceof NodeList) {
    nodes = Array.from(target);
  } else {
    throw new TypeError('target is expected string, Element or NodeListOf<Element>');
  }
  const targets = nodes.map(node => {
    const name = (node.getAttribute('is') || node.tagName).toLowerCase();
    if (!has(name)) {
      return Promise.resolve(null);
    }
    const info = get(name) as IComponentInfo & IComponentOptions;
    const tag = new info.Base(info);
    if (info.init instanceof Function) {
      info.init.call(tag);
    }
    return tag.render().then(nodes => {
      putNodes(node, nodes);
      return tag;
    });
  });
  return Promise.all(targets).then(c => {
    const tags = c.filter(Boolean) as IComponent[];
    if (tags.length === 0) {
      return [];
    } else if (tags.length === 1) {
      return tags[0];
    }
    return tags;
  });
}
