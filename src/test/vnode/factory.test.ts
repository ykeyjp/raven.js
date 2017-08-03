import test from 'ava';
import factory from '../../lib/vnode/factory';
import Looper from '../../lib/vnode/Looper';
import VElement from '../../lib/vnode/VElement';
import Virtual from '../../lib/vnode/Virtual';
import VText from '../../lib/vnode/VText';
import Yield from '../../lib/vnode/Yield';
import '../browser';
import {DummyComponent} from './dummy';

const dummyAttrs = {static: {}, dynamic: {}, event: {}};

test('#text', t => {
  const vnode = factory.build(
    {
      attrs: {static: {content: 'text'}, dynamic: {}, event: {}},
      name: '#text',
    },
    new DummyComponent()
  );
  t.true(vnode instanceof VText);
});

test('element', t => {
  const vnode = factory.build(
    {
      attrs: dummyAttrs,
      name: 'div',
    },
    new DummyComponent()
  );
  t.true(vnode instanceof VElement);
});

test('virtual', t => {
  const vnode = factory.build(
    {
      attrs: dummyAttrs,
      name: 'virtual',
    },
    new DummyComponent()
  );
  t.true(vnode instanceof Virtual);
});

test('yield', t => {
  const vnode = factory.build(
    {
      attrs: dummyAttrs,
      name: 'yield',
    },
    new DummyComponent()
  );
  t.true(vnode instanceof Yield);
});

test('looper', t => {
  const vnode = factory.build(
    {
      attrs: {
        dynamic: {
          each() {
            return this.items;
          },
        },
        event: {},
        static: {},
      },
      name: 'div',
    },
    new DummyComponent()
  );
  t.true(vnode instanceof Looper);
});
