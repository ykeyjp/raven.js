class VText {
  constructor(component, tmpl) {
    this.context = component;
    this.real = null;
    if (tmpl.attrs.dynamic && tmpl.attrs.dynamic.content) {
      this.text = tmpl.attrs.dynamic.content;
    } else {
      this.text = tmpl.attrs.static.content;
    }
  }

  /**
   * @return {HTMLElement}
   */
  render() {
    return new Promise(resolve => {
      if (!this.real) {
        const initialText = this.text instanceof Function ? '' : this.text;
        this.real = document.createTextNode(initialText);
      }
      if (this.text instanceof Function) {
        const text = this.text.call(this.context);
        if (this.real.textContent !== text) {
          this.real.textContent = text;
        }
      }
      resolve(this.real);
    });
  }

  dispose() {
    if (this.real.parentElement) {
      this.real.parentElement.removeChild(this.real);
    }
    this.real = null;
  }
}

module.exports = VText;
