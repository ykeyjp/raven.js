import test from 'ava';
import Looper from '../../lib/vnode/looper';
import '../browser';
import {DummyComponent} from './dummy';

test('array loop', async t => {
  const tag = new DummyComponent();
  const looper = new Looper(tag, {
    attrs: {
      dynamic: {
        each() {
          return this.items;
        },
      },
      event: {},
      static: {},
    },
    children: [
      {
        attrs: {
          dynamic: {
            content() {
              return this.$$.item;
            },
          },
          event: {},
          static: {},
        },
        name: '#text',
      },
    ],
    name: 'li',
  });
  tag.items = [1, 2];
  const nodes1 = (await looper.render()) as Element[];
  t.true(Array.isArray(nodes1));
  t.is(nodes1.length, 2);
  t.is(nodes1[0].outerHTML, '<li>1</li>');
  t.is(nodes1[1].outerHTML, '<li>2</li>');
  tag.items = [1];
  const nodes2 = (await looper.render()) as Element[];
  t.is(nodes2.length, 1);
  t.is(nodes2[0].outerHTML, '<li>1</li>');
  const nodes3 = (await looper.render()) as Element[];
  t.is(nodes3.length, 1);
  t.is(nodes3[0].outerHTML, '<li>1</li>');
});

test('object loop', async t => {
  const tag = new DummyComponent();
  const looper = new Looper(tag, {
    attrs: {
      dynamic: {
        each() {
          return this.items;
        },
      },
      event: {},
      static: {},
    },
    children: [
      {
        attrs: {
          dynamic: {
            content() {
              return this.$$.item;
            },
          },
          event: {},
          static: {},
        },
        name: '#text',
      },
    ],
    name: 'li',
  });
  tag.items = {a: 1, b: 2};
  const nodes1 = (await looper.render()) as Element[];
  t.true(Array.isArray(nodes1));
  t.is(nodes1.length, 2);
  t.is(nodes1[0].outerHTML, '<li>1</li>');
  t.is(nodes1[1].outerHTML, '<li>2</li>');
  tag.items = {a: 1};
  const nodes2 = (await looper.render()) as Element[];
  t.is(nodes2.length, 1);
  t.is(nodes2[0].outerHTML, '<li>1</li>');
  tag.items = {a: 2};
  const nodes3 = (await looper.render()) as Element[];
  t.is(nodes3.length, 1);
  t.is(nodes3[0].outerHTML, '<li>2</li>');
  tag.items = {a: 1, b: 2};
  const nodes4 = (await looper.render()) as Element[];
  t.is(nodes4.length, 2);
  t.is(nodes4[0].outerHTML, '<li>1</li>');
  t.is(nodes4[1].outerHTML, '<li>2</li>');
});

test('dispose', async t => {
  const tag = new DummyComponent();
  const looper = new Looper(tag, {
    attrs: {
      dynamic: {
        each() {
          return this.items;
        },
      },
      event: {},
      static: {},
    },
    children: [
      {
        attrs: {
          dynamic: {
            content() {
              return this.$$.item;
            },
          },
          event: {},
          static: {},
        },
        name: '#text',
      },
    ],
    name: 'li',
  });
  tag.items = [1, 2];
  const nodes1 = (await looper.render()) as Element[];
  t.true(Array.isArray(nodes1));
  t.is(nodes1.length, 2);
  t.is(nodes1[0].outerHTML, '<li>1</li>');
  t.is(nodes1[1].outerHTML, '<li>2</li>');
  t.notThrows(() => {
    looper.dispose();
  });
});
