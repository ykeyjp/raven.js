import test from 'ava';
import Tag from '../../lib/component/tag';

require('browser-env')();

test('render', async t => {
  const tag = new Tag({
    tmpl: {name: 'div', attrs: {}},
    init() {
      this.mixin('mixin1');
    },
  });
  const node1 = await tag.render();
  t.true(node1 instanceof HTMLDivElement);
  const node2 = await tag.update();
  t.true(node2 instanceof HTMLDivElement);
  const node3 = await tag.update({data: 1});
  t.true(node3 instanceof HTMLDivElement);
  t.deepEqual(tag.$, {data: 1});
});

test('render - multi', async t => {
  const tag = new Tag({
    tmpl: [{name: 'div', attrs: {}}, {name: 'div', attrs: {}}],
  });
  const nodes1 = await tag.render();
  t.true(Array.isArray(nodes1));
  t.is(nodes1.length, 2);
  const nodes2 = await tag.update();
  t.true(Array.isArray(nodes2));
  t.is(nodes2.length, 2);
  const nodes3 = await tag.update({data: 1});
  t.true(Array.isArray(nodes3));
  t.is(nodes3.length, 2);
  t.deepEqual(tag.$, {data: 1});
});

test('refs', async t => {
  const tag = new Tag({
    tmpl: [
      {
        name: 'div',
        attrs: {
          static: {ref: 'box'},
          dynamic: {
            if() {
              return this.$.visible;
            },
          },
        },
      },
      {
        name: 'div',
        attrs: {
          static: {ref: 'box'},
          dynamic: {
            if() {
              return this.$.visible;
            },
          },
        },
      },
      {
        name: 'div',
        attrs: {static: {ref: 'box'}},
        children: [
          {
            name: 'div',
            attrs: {
              static: {ref: 'child'},
              dynamic: {
                if() {
                  return this.$.visible;
                },
              },
            },
          },
        ],
      },
    ],
  });
  tag.$.visible = true;
  await tag.render();
  t.true(Array.isArray(tag.refs.box));
  t.true(tag.refs.box.length === 3);
  t.true(tag.refs.child instanceof HTMLDivElement);
  tag.$.visible = false;
  await tag.update();
  t.true(tag.refs.box instanceof HTMLDivElement);
  t.is(tag.refs.child, undefined);
});
