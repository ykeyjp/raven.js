const flatten = require('@ykey/util/array/flatten');
const clone = require('@ykey/util/object/simple-clone');
const diff = require('@ykey/util/object/simple-diff');
const toCamelCase = require('@ykey/util/string/to-camel-case');
const toKebabCase = require('@ykey/util/string/to-kebab-case');
const toPascalCase = require('@ykey/util/string/to-pascal-case');
const toSnakeCase = require('@ykey/util/string/to-snake-case');
const SimpleEvent = require('@ykey/util/event/simple-event');
const componentManager = require('./system/component');
const mixinManager = require('./system/mixin');
const styleManager = require('./system/style');
const putNodes = require('./util/put-nodes');

module.exports.tag = componentManager.tag;
module.exports.mount = componentManager.mount;
module.exports.mixin = mixinManager.register;
module.exports.utils = {
  styleManager,
  componentManager,
  array: {
    flatten,
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
  event: {
    SimpleEvent,
  },
  node: {
    putNodes,
  },
};
