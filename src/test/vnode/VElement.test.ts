import test from 'ava';
import VElement from '../../lib/vnode/VElement';
import '../browser';
import {DummyComponent} from './dummy';

const dummyAttrs = {static: {}, dynamic: {}, event: {}};

test('static attribute', async t => {
  const tag = new DummyComponent();
  const vnode = new VElement(tag, {
    attrs: {static: {foo: 'bar'}, dynamic: {}, event: {}},
    name: 'div',
  });
  const node = (await vnode.render()) as Element;
  t.is(node.tagName, 'DIV');
  t.is(node.getAttribute('foo'), 'bar');
});

test('dynamic attribute', async t => {
  const tag = new DummyComponent();
  const vnode = new VElement(tag, {
    attrs: {
      dynamic: {
        foo() {
          return this.foo;
        },
      },
      event: {},
      static: {},
    },
    name: 'div',
  });
  tag.foo = 'bar1';
  const node1 = (await vnode.render()) as Element;
  t.is(node1.tagName, 'DIV');
  t.is(node1.getAttribute('foo'), 'bar1');
  tag.foo = 'bar2';
  const node2 = (await vnode.render()) as Element;
  t.is(node2.tagName, 'DIV');
  t.is(node2.getAttribute('foo'), 'bar2');
  t.is(node1, node2);
  await vnode.render();
  t.is(node2.tagName, 'DIV');
  t.is(node2.getAttribute('foo'), 'bar2');
  t.is(node1, node2);
});

test('event', async t => {
  const tag = new DummyComponent();
  t.plan(1);
  const vnode = new VElement(tag, {
    attrs: {
      dynamic: {},
      event: {
        click() {
          t.pass();
        },
      },
      static: {},
    },
    name: 'div',
  });
  const node = (await vnode.render()) as Element;
  const event = document.createEvent('MouseEvent');
  event.initEvent('click', false, false);
  node.dispatchEvent(event);
});

test('on/off', async t => {
  const tag = new DummyComponent();
  const parent = new VElement(tag, {name: 'div', attrs: dummyAttrs});
  const child = new VElement(tag, {name: 'div', attrs: dummyAttrs});
  const vnode = new VElement(tag, {
    attrs: {
      dynamic: {
        if() {
          return this.visible;
        },
      },
      event: {},
      static: {},
    },
    name: 'div',
  });
  parent.children = [vnode];
  vnode.children = [child];
  tag.visible = true;
  const node1 = (await parent.render()) as Element;
  t.is(node1.tagName, 'DIV');
  tag.visible = false;
  const node2 = (await parent.render()) as Element;
  t.is(node2.tagName, 'DIV');
  t.is(node1, node2);
});
