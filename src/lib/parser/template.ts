import {IAttributeObject, ITemplateNode} from '../types/template';
import parseAttribute from './attribute';
import parseText from './text';

const tagExpr = /<([-:a-zA-Z0-9]+)(\b[^>]*)>([\s\S]*?)<\/\1>/gm;
const tag2Expr = /<([-:a-zA-Z0-9]+)(\b[^>]*?)[/]{0,1}>/gm;
const partExpr = /^__[0-9]+__$/;
const seperator = '{=}';

export default function template(html: string, multi = false): ITemplateNode | ITemplateNode[] {
  tagExpr.lastIndex = 0;
  tag2Expr.lastIndex = 0;
  const tags: {[key: string]: ITemplateNode} = {};
  let position = 0;
  const result = html
    .replace(tagExpr, (all, tag: string, attrs: string, inner: string) => {
      const p = position++;
      tags['t' + p] = {
        attrs: parseAttribute(attrs.trim()),
        children: template(inner, true),
        name: tag,
      };
      return seperator + '__' + p + '__' + seperator;
    })
    .replace(tag2Expr, (all, tag: string, attrs: string) => {
      const p = position++;
      tags['t' + p] = {
        attrs: parseAttribute(attrs.trim()),
        children: [],
        name: tag,
      };
      return seperator + '__' + p + '__' + seperator;
    });
  const nodes: ITemplateNode[] = result
    .split('{=}')
    .map(part => {
      part = part.trim();
      if (part.length === 0) {
        return null;
      }
      partExpr.lastIndex = 0;
      if (partExpr.test(part)) {
        return tags['t' + part.substr(2, part.length - 4)];
      }
      const parsedText = parseText(part);
      const textAttrs: IAttributeObject = {static: {}, dynamic: {}, event: {}};
      if (parsedText instanceof Function) {
        textAttrs.dynamic.content = parsedText;
      } else {
        textAttrs.static.content = parsedText;
      }
      return {
        attrs: textAttrs,
        name: '#text',
      };
    })
    .filter(Boolean) as ITemplateNode[];
  if (!multi && nodes.length === 1) {
    return nodes[0];
  }
  return nodes;
}
