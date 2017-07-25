import test from 'ava';
import Looper from '../../lib/vnode/looper';

require('browser-env')();

test('array loop', async t => {
  const tag = {};
  const looper = new Looper(tag, {
    name: 'li',
    attrs: {
      dynamic: {
        each() {
          return this.items;
        },
      },
    },
    children: [
      {
        name: '#text',
        attrs: {
          dynamic: {
            content() {
              return this.$$.item;
            },
          },
        },
      },
    ],
  });
  tag.items = [1, 2];
  const nodes1 = await looper.render();
  t.true(Array.isArray(nodes1));
  t.is(nodes1.length, 2);
  t.is(nodes1[0].outerHTML, '<li>1</li>');
  t.is(nodes1[1].outerHTML, '<li>2</li>');
  tag.items = [1];
  const nodes2 = await looper.render();
  t.is(nodes2.length, 1);
  t.is(nodes2[0].outerHTML, '<li>1</li>');
  const nodes3 = await looper.render();
  t.is(nodes3.length, 1);
  t.is(nodes3[0].outerHTML, '<li>1</li>');
});

test('object loop', async t => {
  const tag = {};
  const looper = new Looper(tag, {
    name: 'li',
    attrs: {
      dynamic: {
        each() {
          return this.items;
        },
      },
    },
    children: [
      {
        name: '#text',
        attrs: {
          dynamic: {
            content() {
              return this.$$.item;
            },
          },
        },
      },
    ],
  });
  tag.items = {a: 1, b: 2};
  const nodes1 = await looper.render();
  t.true(Array.isArray(nodes1));
  t.is(nodes1.length, 2);
  t.is(nodes1[0].outerHTML, '<li>1</li>');
  t.is(nodes1[1].outerHTML, '<li>2</li>');
  tag.items = {a: 1};
  const nodes2 = await looper.render();
  t.is(nodes2.length, 1);
  t.is(nodes2[0].outerHTML, '<li>1</li>');
  tag.items = {a: 2};
  const nodes3 = await looper.render();
  t.is(nodes3.length, 1);
  t.is(nodes3[0].outerHTML, '<li>2</li>');
  tag.items = {a: 1, b: 2};
  const nodes4 = await looper.render();
  t.is(nodes4.length, 2);
  t.is(nodes4[0].outerHTML, '<li>1</li>');
  t.is(nodes4[1].outerHTML, '<li>2</li>');
});

test('dispose', async t => {
  const tag = {};
  const looper = new Looper(tag, {
    name: 'li',
    attrs: {
      dynamic: {
        each() {
          return this.items;
        },
      },
    },
    children: [
      {
        name: '#text',
        attrs: {
          dynamic: {
            content() {
              return this.$$.item;
            },
          },
        },
      },
    ],
  });
  tag.items = [1, 2];
  const nodes1 = await looper.render();
  t.true(Array.isArray(nodes1));
  t.is(nodes1.length, 2);
  t.is(nodes1[0].outerHTML, '<li>1</li>');
  t.is(nodes1[1].outerHTML, '<li>2</li>');
  t.notThrows(() => {
    looper.dispose();
  });
});
