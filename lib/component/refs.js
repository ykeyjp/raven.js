function add(component, ref, target) {
  if (!component.refs) {
    return;
  }
  if (Array.isArray(component.refs[ref])) {
    component.refs[ref].push(target);
  } else if (component.refs[ref]) {
    component.refs[ref] = [component.refs[ref], target];
  } else {
    component.refs[ref] = target;
  }
}

function remove(component, ref, target) {
  if (!component.refs) {
    return;
  }
  if (Array.isArray(component.refs[ref])) {
    const index = component.refs[ref].indexOf(target);
    if (index !== -1) {
      component.refs[ref].splice(index, 1);
    }
    if (component.refs[ref].length === 1) {
      component.refs[ref] = component.refs[ref][0];
    } else if (component.refs[ref].length === 0) {
      delete component.refs[ref];
    }
  } else if (component.refs[ref] === target) {
    delete component.refs[ref];
  }
}

module.exports.add = add;
module.exports.remove = remove;
