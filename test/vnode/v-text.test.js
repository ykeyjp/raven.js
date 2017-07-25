import test from 'ava';
import VText from '../../lib/vnode/v-text';

require('browser-env')();

test('static', async t => {
  const tag = {};
  const vnode = new VText(tag, {
    name: '#text',
    attrs: {static: {content: 'text'}},
  });
  const node = await vnode.render();
  t.is(node.textContent, 'text');
});

test('dynamic', async t => {
  const tag = {};
  const vnode = new VText(tag, {
    name: '#text',
    attrs: {
      dynamic: {
        content() {
          return this.text;
        },
      },
    },
  });
  tag.text = 'text1';
  const node1 = await vnode.render();
  t.is(node1.textContent, 'text1');
  tag.text = 'text2';
  const node2 = await vnode.render();
  t.is(node2.textContent, 'text2');
  t.is(node1, node2);
  tag.text = 'text2';
  await vnode.render();
  t.is(node2.textContent, 'text2');
  t.is(node1, node2);
});

test('dispose', async t => {
  const tag = {};
  const vnode = new VText(tag, {
    name: '#text',
    attrs: {static: {content: 'text'}},
  });
  const node = await vnode.render();
  t.is(node.textContent, 'text');
  vnode.dispose();
  t.is(vnode.real, null);
});
