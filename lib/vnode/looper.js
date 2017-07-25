const clone = require('@ykey/util/object/simple-clone');
const factory = require('./factory');

class Looper {
  constructor(component, tmpl) {
    this.context = component;
    tmpl = clone(tmpl);
    this.generator = tmpl.attrs.dynamic.each;
    delete tmpl.attrs.dynamic.each;
    this.nodeCache = [];
    this.itemCache = '';
    this.vnodes = [];
    this.tmpl = tmpl;
  }

  /**
   * @return {PromiseLike}
   */
  render() {
    const list = this.generator.call(this.context);
    let items = null;
    if (Array.isArray(list)) {
      items = list.map((v, i) => ({key: i, item: v}));
    } else {
      items = Object.keys(list).map(k => ({key: k, item: list[k]}));
    }
    const item$json = JSON.stringify(items);
    if (this.itemCache === item$json) {
      return this.nodeCache;
    }
    if (this.vnodes.length < items.length) {
      for (let i = this.vnodes.length, l = items.length; i < l; ++i) {
        this.vnodes.push(
          factory.build(
            this.tmpl,
            Object.assign(
              Object.create(Object.getPrototypeOf(this.context)),
              this.context
            )
          )
        );
      }
    } else if (this.vnodes.length > items.length) {
      for (let i = items.length, l = this.vnodes.length; i < l; ++i) {
        this.vnodes[i].dispose();
      }
      this.vnodes.length = items.length;
    }
    return Promise.all(
      this.vnodes.map((vnode, i) => {
        Object.assign(vnode.context, this.context, {$$: items[i]});
        return vnode.render();
      })
    ).then(nodes => {
      this.nodeCache = nodes;
      this.itemCache = item$json;
      return nodes;
    });
  }

  dispose() {
    this.vnodes.forEach(vnode => vnode.dispose());
    this.nodeCache = [];
    this.itemCache = '';
    this.vnodes = [];
  }
}

module.exports = Looper;
