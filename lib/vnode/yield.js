class Yield {
  constructor(component) {
    this.context = component;
  }

  /**
   * @return {PromiseLike}
   */
  render() {
    return Promise.resolve(this.context.$yield || []);
  }

  dispose() {}
}

module.exports = Yield;
