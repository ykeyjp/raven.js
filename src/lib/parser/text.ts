import wrapExpr from './wrap';

const tmplExpr = /\{\{([\s\S]+?)\}\}/g;

export default function text(src: string): string | Function {
  tmplExpr.lastIndex = 0;
  if (!tmplExpr.test(src)) {
    return src;
  }
  const parts: string[] = [];
  let m: RegExpExecArray | null;
  let pindex = 0;
  tmplExpr.lastIndex = 0;
  while (true) {
    m = tmplExpr.exec(src);
    if (!m) {
      break;
    }
    parts.push("'" + escapeText(src.slice(pindex, m.index)) + "'");
    parts.push('(function(){return ' + wrapExpr(m[1]) + ';}).call(this)');
    pindex += m.index + m[0].length;
  }
  if (pindex < src.length) {
    parts.push("'" + escapeText(src.slice(pindex, src.length)) + "'");
  }
  return Function('return "".concat(' + parts.join(',') + ');');
}

function escapeText(src: string): string {
  return src.replace(/'/g, "\\'").replace(/\r?\n/g, '\\n');
}
