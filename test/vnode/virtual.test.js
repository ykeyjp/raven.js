import test from 'ava';
import Virtual from '../../lib/vnode/virtual';
import VElement from '../../lib/vnode/v-element';
import Tag from '../../lib/component/tag';

require('browser-env')();

test('none', async t => {
  const vnode = new Virtual({}, {name: 'virtual', attrs: {}});
  const nodes1 = await vnode.render();
  t.deepEqual(nodes1, []);
});

test('children', async t => {
  const tag = {};
  const vnode = new Virtual(tag, {
    name: 'virtual',
    attrs: {},
  });
  vnode.children = [new VElement(tag, {name: 'div', attrs: {}})];
  const nodes1 = await vnode.render();
  t.true(nodes1[0] instanceof HTMLDivElement);
});

test('on/off', async t => {
  const tag = {};
  const vnode = new Virtual(tag, {
    name: 'virtual',
    attrs: {
      dynamic: {
        if() {
          return this.visible;
        },
      },
    },
  });
  vnode.children = [new VElement(tag, {name: 'div', attrs: {}})];
  tag.visible = true;
  const nodes1 = await vnode.render();
  t.true(nodes1[0] instanceof HTMLDivElement);
  tag.visible = false;
  const nodes2 = await vnode.render();
  t.is(nodes2.length, 0);
});

test('component', async t => {
  const tag = {};
  const vnode = new Virtual(
    tag,
    {
      name: 'virtual',
      attrs: {
        static: {ref: 'tag'},
        dynamic: {
          if() {
            return this.visible;
          },
        },
      },
    },
    {base: Tag, tmpl: {name: 'div', attrs: {}}, init() {}}
  );
  tag.visible = true;
  const node1 = await vnode.render();
  t.true(node1 instanceof HTMLDivElement);
  await vnode.render();
  tag.visible = false;
  const node2 = await vnode.render();
  t.deepEqual(node2, []);
});

test('component - multi', async t => {
  const tag = {};
  const vnode = new Virtual(
    tag,
    {
      name: 'virtual',
      attrs: {
        dynamic: {
          if() {
            return this.visible;
          },
        },
      },
    },
    {
      base: Tag,
      tmpl: [
        {name: 'div', attrs: {static: {ref: 'tag'}}},
        {name: 'div', attrs: {static: {ref: 'tag'}}},
      ],
    }
  );
  tag.visible = true;
  const nodes1 = await vnode.render();
  t.true(Array.isArray(nodes1));
  await vnode.render();
  tag.visible = false;
  const node2 = await vnode.render();
  t.deepEqual(node2, []);
});
