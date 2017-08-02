import test from 'ava';
import VText from '../../lib/vnode/VText';
import '../browser';
import {DummyComponent} from './dummy';

test('static', async t => {
  const tag = new DummyComponent();
  const vnode = new VText(tag, {
    attrs: {static: {content: 'text'}, dynamic: {}, event: {}},
    name: '#text',
  });
  const node = await vnode.render();
  t.is(node.textContent, 'text');
});

test('dynamic', async t => {
  const tag = new DummyComponent();
  const vnode = new VText(tag, {
    attrs: {
      dynamic: {
        content() {
          return this.text;
        },
      },
      event: {},
      static: {},
    },
    name: '#text',
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
  const tag = new DummyComponent();
  const vnode = new VText(tag, {
    attrs: {static: {content: 'text'}, dynamic: {}, event: {}},
    name: '#text',
  });
  const node = await vnode.render();
  t.is(node.textContent, 'text');
  vnode.dispose();
  t.is(vnode.real, null);
});
