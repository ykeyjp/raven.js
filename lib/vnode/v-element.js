const putNodes = require('../util/put-nodes');
const refs = require('../component/refs');

class VElement {
  constructor(component, tmpl) {
    this.context = component;
    this.real = null;
    this.tmpl = {
      name: tmpl.name,
      attrs: {
        static: tmpl.attrs.static || {},
        dynamic: tmpl.attrs.dynamic || {},
        event: tmpl.attrs.event || {},
      },
    };
    this.children = null;
    this.cache = {};
  }

  /**
   * @return {PromiseLike}
   */
  render() {
    return new Promise(resolve => {
      const attrs = {};
      Object.keys(this.tmpl.attrs.dynamic).forEach(key => {
        attrs[key] = this.tmpl.attrs.dynamic[key].call(this.context);
      });
      if (attrs.if === false) {
        this.dispose();
      } else if (this.real) {
        Object.keys(attrs).forEach(key => {
          if (this.cache[key] !== attrs[key]) {
            this.real.setAttribute(key, attrs[key]);
          }
        });
      } else {
        this.real = document.createElement(this.tmpl.name);
        Object.keys(this.tmpl.attrs.static).forEach(key => {
          this.real.setAttribute(key, this.tmpl.attrs.static[key]);
        });
        Object.keys(attrs).forEach(key => {
          this.real.setAttribute(key, attrs[key]);
        });
        Object.keys(this.tmpl.attrs.event).forEach(key => {
          this.real.addEventListener(key, this.tmpl.attrs.event[key]);
        });
        if (this.tmpl.attrs.static.ref) {
          refs.add(this.context, this.tmpl.attrs.static.ref, this.real);
        }
      }
      this.cache = attrs;
      if (this.real) {
        const childrenDefer = Array.isArray(this.children)
          ? Promise.all(this.children.map(c => c.render()))
          : Promise.resolve([]);
        childrenDefer.then(children => {
          putNodes(this.real, children);
          resolve(this.real);
        });
      } else {
        resolve(null);
      }
    });
  }

  dispose() {
    if (this.real && this.tmpl.attrs.static.ref) {
      refs.remove(this.context, this.tmpl.attrs.static.ref, this.real);
    }
    if (this.real && this.real.parentElement) {
      this.real.parentElement.removeChild(this.real);
    }
    this.real = null;
    if (Array.isArray(this.children)) {
      this.children.forEach(c => c.dispose());
    }
  }
}

module.exports = VElement;
