const flatten = require('@ykey/util/array/flatten');
const refs = require('../component/refs');

class Virtual {
  constructor(component, tmpl, info = null) {
    this.context = component;
    this.tmpl = {
      name: tmpl.name,
      attrs: {
        static: tmpl.attrs.static || {},
        dynamic: tmpl.attrs.dynamic || {},
        event: tmpl.attrs.event || {},
      },
    };
    this.children = null;
    this.componentInfo = info;
    this.component = null;
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
        resolve([]);
        return;
      }
      const childDefer = Array.isArray(this.children)
        ? Promise.all(this.children.map(c => c.render()))
        : Promise.resolve([]);
      childDefer.then(children => {
        children = flatten(children);
        if (!this.componentInfo) {
          resolve(children);
          return;
        }
        if (this.component) {
          this.component.$yield = children;
          this.component.update(attrs).then(nodes => {
            resolve(Array.isArray(nodes) ? flatten(nodes) : nodes);
          });
          return;
        }
        const BaseComponent = this.componentInfo.base;
        this.component = new BaseComponent(
          Object.assign({parent: this.context}, this.componentInfo)
        );
        Object.assign(
          this.component.$,
          this.tmpl.attrs.static,
          attrs,
          this.tmpl.attrs.event
        );
        this.component.$yield = children;
        if (this.componentInfo.init instanceof Function) {
          this.componentInfo.init.call(this.component);
        }
        if (this.tmpl.attrs.static.ref) {
          refs.add(this.context, this.tmpl.attrs.static.ref, this.component);
        }
        this.component.render().then(nodes => {
          resolve(Array.isArray(nodes) ? flatten(nodes) : nodes);
        });
      });
    });
  }

  dispose() {
    if (Array.isArray(this.children)) {
      this.children.forEach(c => c.dispose());
    }
    if (this.component) {
      if (this.tmpl.attrs.static.ref) {
        refs.remove(this.context, this.tmpl.attrs.static.ref, this.component);
      }
      this.component.dispose();
      this.component = null;
    }
  }
}

module.exports = Virtual;
