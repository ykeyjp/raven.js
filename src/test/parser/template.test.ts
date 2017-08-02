import test from 'ava';
import template from '../../lib/parser/template';
import {ITemplateNode} from '../../lib/types/template';

test('text', t => {
  t.deepEqual(template('text'), {
    attrs: {static: {content: 'text'}, dynamic: {}, event: {}},
    name: '#text',
  });
});

test('dynamic text', t => {
  const node = template('{{this.text}}') as ITemplateNode;
  t.deepEqual(Object.keys(node), ['attrs', 'name']);
  t.deepEqual(Object.keys(node.attrs), ['static', 'dynamic', 'event']);
  t.true(node.attrs.dynamic.content instanceof Function);
  t.is(node.attrs.dynamic.content!.call({text: 'foo'}), 'foo');
});

test('single', t => {
  t.deepEqual(template('<p foo="bar">text.</p>'), {
    attrs: {static: {foo: 'bar'}, dynamic: {}, event: {}},
    children: [{name: '#text', attrs: {static: {content: 'text.'}, dynamic: {}, event: {}}}],
    name: 'p',
  });
});

test('multi', t => {
  t.deepEqual(template('<div>text1.</div><div>text2.</div>'), [
    {
      attrs: {static: {}, dynamic: {}, event: {}},
      children: [{name: '#text', attrs: {static: {content: 'text1.'}, dynamic: {}, event: {}}}],
      name: 'div',
    },
    {
      attrs: {static: {}, dynamic: {}, event: {}},
      children: [{name: '#text', attrs: {static: {content: 'text2.'}, dynamic: {}, event: {}}}],
      name: 'div',
    },
  ]);
});

test('empty tag', t => {
  t.deepEqual(template('<input type="text"><br><hr>'), [
    {
      attrs: {static: {type: 'text'}, dynamic: {}, event: {}},
      children: [],
      name: 'input',
    },
    {
      attrs: {static: {}, dynamic: {}, event: {}},
      children: [],
      name: 'br',
    },
    {
      attrs: {static: {}, dynamic: {}, event: {}},
      children: [],
      name: 'hr',
    },
  ]);
});

test('self close', t => {
  t.deepEqual(template('<ns:tag attr1="foo" attr2="bar"/>'), {
    attrs: {
      dynamic: {},
      event: {},
      static: {attr1: 'foo', attr2: 'bar'},
    },
    children: [],
    name: 'ns:tag',
  });
});
