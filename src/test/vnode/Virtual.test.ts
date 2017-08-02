import test from 'ava';
import Tag from '../../lib/component/Tag';
import VElement from '../../lib/vnode/VElement';
import Virtual from '../../lib/vnode/Virtual';
import '../browser';
import {DummyComponent} from './dummy';

const dummyAttrs = {static: {}, dynamic: {}, event: {}};

test('none', async t => {
  const vnode = new Virtual(new DummyComponent(), {name: 'virtual', attrs: dummyAttrs});
  const nodes1 = await vnode.render();
  t.deepEqual(nodes1, []);
});

test('children', async t => {
  const tag = new DummyComponent();
  const vnode = new Virtual(tag, {
    attrs: dummyAttrs,
    name: 'virtual',
  });
  vnode.children = [new VElement(tag, {name: 'div', attrs: dummyAttrs})];
  const nodes1 = (await vnode.render()) as Node[];
  t.true(nodes1[0] instanceof HTMLDivElement);
});

test('on/off', async t => {
  const tag = new DummyComponent();
  const vnode = new Virtual(tag, {
    attrs: {
      dynamic: {
        if() {
          return this.visible;
        },
      },
      event: {},
      static: {},
    },
    name: 'virtual',
  });
  vnode.children = [new VElement(tag, {name: 'div', attrs: dummyAttrs})];
  tag.visible = true;
  const nodes1 = (await vnode.render()) as Node[];
  t.true(nodes1[0] instanceof HTMLDivElement);
  tag.visible = false;
  const nodes2 = (await vnode.render()) as Node[];
  t.is(nodes2.length, 0);
});

test('component', async t => {
  const tag = new DummyComponent();
  const vnode = new Virtual(
    tag,
    {
      attrs: {
        dynamic: {
          if(this: any) {
            return this.visible;
          },
        },
        event: {},
        static: {ref: 'tag'},
      },
      name: 'virtual',
    },
    {Base: Tag, tmpl: {name: 'div', attrs: dummyAttrs}, init() {}}
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
  const tag = new DummyComponent();
  const vnode = new Virtual(
    tag,
    {
      attrs: {
        dynamic: {
          if(this: any) {
            return this.visible;
          },
        },
        event: {},
        static: {},
      },
      name: 'virtual',
    },
    {
      Base: Tag,
      tmpl: [
        {name: 'div', attrs: {dynamic: {}, event: {}, static: {ref: 'tag'}}},
        {name: 'div', attrs: {dynamic: {}, event: {}, static: {ref: 'tag'}}},
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
