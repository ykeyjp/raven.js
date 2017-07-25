const SimpleEvent = require('@ykey/util/event/simple-event');
const factory = require('../vnode/factory');
const mixin = require('../system/mixin');

class Tag {
  constructor(options) {
    this.parent = options.parent;
    this.vnode = factory.build(options.tmpl, this);
    this.event = new SimpleEvent();
    this.$ = {};
    this.refs = {};
    this._ = {
      isMounted: false,
    };
  }

  update(attrs = {}) {
    Object.assign(this.$, attrs);
    return this.render();
  }

  /**
   * @return {PromiseLike<any>}
   */
  render() {
    return new Promise(resolve => {
      let nodes = null;
      if (Array.isArray(this.vnode)) {
        const defers = this.vnode.map(vnode => vnode.render()).filter(Boolean);
        nodes = Promise.all(defers);
      } else {
        nodes = this.vnode.render();
      }
      nodes.then(node => {
        resolve(node);
        if (this._.isMounted) {
          this.event.trigger('update');
        } else {
          this._.isMounted = true;
          this.event.trigger('mount');
        }
      });
    });
  }

  /**
   * @param {string} name
   */
  mixin(name) {
    mixin.apply(this, name);
  }

  dispose() {
    this.event.trigger('unmount');
    this.event.reset();
    if (Array.isArray(this.vnode)) {
      this.vnode.forEach(vnode => vnode.dispose());
    } else {
      this.vnode.dispose();
    }
    this.parent = null;
  }
}

module.exports = Tag;
