const mixins = {};

/**
 * @param {string} name
 * @param {object} mixin
 */
function register(name, mixin) {
  mixins[name] = mixin;
}

/**
 * @param {object} component
 * @param {string} name
 */
function apply(component, name) {
  if (!mixins[name]) {
    return;
  }
  let obj = mixins[name];
  const init = obj.init;
  while (obj) {
    _apply(component, obj);
    const proto = Object.getPrototypeOf(obj);
    if (isBaseObject(proto)) {
      break;
    }
    obj = proto;
  }
  if (init instanceof Function) {
    init.call(component);
  }
}

/**
 * @param {object} component
 * @param {object} obj
 */
function _apply(component, obj) {
  Object.getOwnPropertyNames(obj).forEach(key => {
    if (key === 'constructor' || key === 'init') {
      return;
    }
    if (!Object.prototype.hasOwnProperty.call(component, key)) {
      component[key] = obj[key];
    }
  });
}

const baseObjectProps = Object.getOwnPropertyNames(Object.prototype);

/**
 * @param {object} proto
 */
function isBaseObject(proto) {
  return Object.getOwnPropertyNames(proto).every(
    key => baseObjectProps.indexOf(key) !== -1
  );
}

module.exports.mixins = mixins;
module.exports.register = register;
module.exports.apply = apply;
