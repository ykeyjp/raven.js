const mixins: {[key: string]: any} = {};

function register(name: string, mixin: any): void {
  mixins[name] = mixin;
}

function apply(component: any, name: string): void {
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

function _apply(component: any, obj: any): void {
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

function isBaseObject(proto: object): boolean {
  return Object.getOwnPropertyNames(proto).every(key => baseObjectProps.indexOf(key) !== -1);
}

export default {
  apply,
  mixins,
  register,
};
