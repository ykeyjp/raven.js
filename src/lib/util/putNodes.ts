import {flatten} from '@ykey/util';

export default function putNodes(parent: Node, children: Node | Node[] | null | Array<Node | Node[] | null>) {
  if (!parent || !children) {
    return;
  }
  if (Array.isArray(children)) {
    flatten(children).filter(Boolean).forEach((child: Node, i) => {
      if (parent !== child.parentNode || parent.childNodes[i] !== child) {
        parent.insertBefore(child, parent.childNodes[i]);
      }
    });
  } else if (parent !== children.parentNode) {
    parent.appendChild(children);
  }
}
