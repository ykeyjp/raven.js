import test from 'ava';
import VElement from '../../lib/vnode/v-element';

require('browser-env')();

test('static attribute', async t => {
  const tag = {};
  const vnode = new VElement(tag, {
    name: 'div',
    attrs: {static: {foo: 'bar'}, dynamic: {}, event: {}},
  });
  const node = await vnode.render();
  t.is(node.tagName, 'DIV');
  t.is(node.getAttribute('foo'), 'bar');
});

test('dynamic attribute', async t => {
  const tag = {};
  const vnode = new VElement(tag, {
    name: 'div',
    attrs: {
      static: {},
      dynamic: {
        foo() {
          return this.foo;
        },
      },
      event: {},
    },
  });
  tag.foo = 'bar1';
  const node1 = await vnode.render();
  t.is(node1.tagName, 'DIV');
  t.is(node1.getAttribute('foo'), 'bar1');
  tag.foo = 'bar2';
  const node2 = await vnode.render();
  t.is(node2.tagName, 'DIV');
  t.is(node2.getAttribute('foo'), 'bar2');
  t.is(node1, node2);
  await vnode.render();
  t.is(node2.tagName, 'DIV');
  t.is(node2.getAttribute('foo'), 'bar2');
  t.is(node1, node2);
});

test('event', async t => {
  const tag = {};
  t.plan(1);
  const vnode = new VElement(tag, {
    name: 'div',
    attrs: {
      static: {},
      dynamic: {},
      event: {
        click() {
          t.pass();
        },
      },
    },
  });
  const node = await vnode.render();
  const event = document.createEvent('MouseEvent');
  event.initEvent('click');
  node.dispatchEvent(event);
});

test('on/off', async t => {
  const tag = {};
  const parent = new VElement(tag, {name: 'div', attrs: {}});
  const child = new VElement(tag, {name: 'div', attrs: {}});
  const vnode = new VElement(tag, {
    name: 'div',
    attrs: {
      static: {},
      dynamic: {
        if() {
          return this.visible;
        },
      },
      event: {},
    },
  });
  parent.children = [vnode];
  vnode.children = [child];
  tag.visible = true;
  const node1 = await parent.render();
  t.is(node1.tagName, 'DIV');
  tag.visible = false;
  const node2 = await parent.render();
  t.is(node2.tagName, 'DIV');
  t.is(node1, node2);
});
