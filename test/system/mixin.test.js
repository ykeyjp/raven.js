import test from 'ava';
import mixin from '../../lib/system/mixin';

test('simple', t => {
  mixin.register('m1', {name: 'm1', func() {}});
  const component = {name: 'base'};
  mixin.apply(component, 'm1');
  mixin.apply(component, 'm1a');
  t.is(component.name, 'base');
  t.deepEqual(Object.getOwnPropertyNames(component), ['name', 'func']);
});

test('class', t => {
  class M2 {
    constructor() {
      this.name = 'm2';
    }
    func() {}
  }
  mixin.register('m2', new M2());
  const component = {};
  mixin.apply(component, 'm2');
  t.is(component.name, 'm2');
  t.deepEqual(Object.getOwnPropertyNames(component), ['name', 'func']);
});

test('init', t => {
  mixin.register('m3', {
    init() {
      this.name = 'm3';
    },
  });
  const component = {};
  mixin.apply(component, 'm3');
  t.is(component.name, 'm3');
  t.deepEqual(Object.getOwnPropertyNames(component), ['name']);
});
