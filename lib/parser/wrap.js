/**
 * @param {string} src
 * @return {string}
 */
function wrap(src) {
  if (src.indexOf('$') === -1) {
    return src;
  }
  let ret = '';
  let nest = '';
  for (let i = 0, l = src.length; i < l; ++i) {
    const c = src[i];
    if (c === '$' && nest === '') {
      let d = '$';
      while (src[i + 1] === '$') {
        d += '$';
        i++;
      }
      ret += 'this.' + d + '.';
    } else if (c === '"' || c === "'") {
      if (nest === c) {
        nest = '';
      } else {
        nest = c;
      }
      ret += c;
    } else {
      ret += c;
    }
  }
  return ret;
}

module.exports = wrap;
