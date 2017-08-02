import test from 'ava';
import Tag from '../../lib/component/tag';
import {IComponentInfo, IComponentOptions} from '../../lib/types/IComponent';
import {IAttributeObject, ITemplateNode} from '../../lib/types/template';
import '../browser';

test('render', async t => {
  const tag = new Tag(
    {
      Base: Tag,
      tmpl: {name: 'div', attrs: {static: {}, dynamic: {}, event: {}}},
      init() {
        this.mixin('mixin1');
      },
    } as IComponentInfo & IComponentOptions & ThisType<Tag>
  );
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
    Base: Tag,
    tmpl: [
      {name: 'div', attrs: {static: {}, dynamic: {}, event: {}}},
      {name: 'div', attrs: {static: {}, dynamic: {}, event: {}}},
    ],
  });
  const nodes1 = (await tag.render()) as Node[];
  t.true(Array.isArray(nodes1));
  t.is(nodes1.length, 2);
  const nodes2 = (await tag.update()) as Node[];
  t.true(Array.isArray(nodes2));
  t.is(nodes2.length, 2);
  const nodes3 = (await tag.update({data: 1})) as Node[];
  t.true(Array.isArray(nodes3));
  t.is(nodes3.length, 2);
  t.deepEqual(tag.$, {data: 1});
});

test('refs', async t => {
  const tag = new Tag({
    Base: Tag,
    tmpl: [
      {
        attrs: {
          dynamic: {
            if() {
              return this.$.visible;
            },
          },
          event: {},
          static: {ref: 'box'},
        },
        name: 'div',
      },
      {
        attrs: {
          dynamic: {
            if() {
              return this.$.visible;
            },
          },
          event: {},
          static: {ref: 'box'},
        },
        name: 'div',
      },
      {
        attrs: {static: {ref: 'box'}, dynamic: {}, event: {}},
        children: [
          {
            attrs: {
              dynamic: {
                if() {
                  return this.$.visible;
                },
              },
              event: {},
              static: {ref: 'child'},
            },
            name: 'div',
          },
        ],
        name: 'div',
      },
    ],
  });
  tag.$.visible = true;
  await tag.render();
  t.true(Array.isArray(tag.refs.box));
  t.true((tag.refs.box as Node[]).length === 3);
  t.true(tag.refs.child instanceof HTMLDivElement);
  tag.$.visible = false;
  await tag.update();
  t.true(tag.refs.box instanceof HTMLDivElement);
  t.is(tag.refs.child, undefined);
});
