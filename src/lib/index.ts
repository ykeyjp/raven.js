import flatten, {INested} from '@ykey/util/lib/array/flatten';
import SimpleEvent from '@ykey/util/lib/event/SimpleEvent';
import clone from '@ykey/util/lib/object/clone';
import diff, {IDiffResult} from '@ykey/util/lib/object/diff';
import toCamelCase from '@ykey/util/lib/string/toCamelCase';
import toKebabCase from '@ykey/util/lib/string/toKebabCase';
import toPascalCase from '@ykey/util/lib/string/toPascalCase';
import toSnakeCase from '@ykey/util/lib/string/toSnakeCase';
import * as componentManager from './system/component';
import * as mixinManager from './system/mixin';
import * as styleManager from './system/style';
import putNodes from './util/putNodes';

export const tag = componentManager.tag;
export const mount = componentManager.mount;
export const mixin = mixinManager.register;
export const manager = {
  component: componentManager,
  style: styleManager,
};
export const utils = {
  array: {
    flatten,
  },
  event: {
    SimpleEvent,
  },
  node: {
    putNodes,
  },
  object: {
    clone,
    diff,
  },
  string: {
    toCamelCase,
    toKebabCase,
    toPascalCase,
    toSnakeCase,
  },
};
