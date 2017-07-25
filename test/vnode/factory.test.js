import test from 'ava';
import factory from '../../lib/vnode/factory';
import VText from '../../lib/vnode/v-text';
import VElement from '../../lib/vnode/v-element';
import Looper from '../../lib/vnode/looper';
import Virtual from '../../lib/vnode/virtual';
import Yield from '../../lib/vnode/yield';

require('browser-env')();

test('#text', t => {
  const vnode = factory.build({
    name: '#text',
    attrs: {static: {content: 'text'}},
  });
  t.true(vnode instanceof VText);
});

test('element', t => {
  const vnode = factory.build({
    name: 'div',
    attrs: {},
  });
  t.true(vnode instanceof VElement);
});

test('virtual', t => {
  const vnode = factory.build({
    name: 'virtual',
    attrs: {},
  });
  t.true(vnode instanceof Virtual);
});

test('yield', t => {
  const vnode = factory.build({
    name: 'yield',
    attrs: {},
  });
  t.true(vnode instanceof Yield);
});

test('looper', t => {
  const vnode = factory.build({
    name: 'div',
    attrs: {
      dynamic: {
        each() {
          return this.items;
        },
      },
    },
  });
  t.true(vnode instanceof Looper);
});
