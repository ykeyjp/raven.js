import {IComponent} from '../types/IComponent';

export function add(component: IComponent, ref: string, target: IComponent | Node) {
  if (!component.refs) {
    return;
  }
  if (Array.isArray(component.refs[ref])) {
    (component.refs[ref] as Array<IComponent | Node>).push(target);
  } else if (component.refs[ref]) {
    component.refs[ref] = [component.refs[ref], target] as Array<IComponent | Node>;
  } else {
    component.refs[ref] = target;
  }
}

export function remove(component: IComponent, ref: string, target: IComponent | Node) {
  if (!component.refs) {
    return;
  }
  if (Array.isArray(component.refs[ref])) {
    const refs = component.refs[ref] as Array<IComponent | Node>;
    const index = refs.indexOf(target);
    if (index !== -1) {
      refs.splice(index, 1);
    }
    if (refs.length === 1) {
      component.refs[ref] = refs[0];
    } else if (refs.length === 0) {
      delete component.refs[ref];
    }
  } else if (component.refs[ref] === target) {
    delete component.refs[ref];
  }
}
