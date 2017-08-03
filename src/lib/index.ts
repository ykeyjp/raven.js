import {
  clone,
  diff,
  each,
  flatten,
  IDiffResult,
  INested,
  map,
  toCamelCase,
  toKebabCase,
  toPascalCase,
  toSnakeCase,
} from '@ykey/util';
import componentManager, {ITagOptions} from './system/component';
import mixinManager from './system/mixin';
import styleManager from './system/style';
import {IComponent, IComponentConstructor, IComponentInfo, IComponentOptions} from './types/IComponent';
import {IVNode} from './types/IVNode';
import {IAttributeObject, IMixedStyle, IStyleMediaRule, IStyleRule, ITemplateNode} from './types/template';
import putNodes from './util/putNodes';

export default {
  manager: {
    component: componentManager,
    style: styleManager,
  },
  mixin: mixinManager.register,
  mount: componentManager.mount,
  tag: componentManager.tag,
  utils: {clone, diff, each, flatten, map, toCamelCase, toKebabCase, toPascalCase, toSnakeCase},
};

export {
  IComponent,
  IComponentConstructor,
  IComponentInfo,
  IComponentOptions,
  IVNode,
  IAttributeObject,
  IMixedStyle,
  IStyleMediaRule,
  IStyleRule,
  ITemplateNode,
  ITagOptions,
  IDiffResult,
  INested,
};
