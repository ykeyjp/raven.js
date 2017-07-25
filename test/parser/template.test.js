import test from 'ava';
import template from '../../lib/parser/template';

test('text', t => {
  t.deepEqual(template('text'), {
    name: '#text',
    attrs: {static: {content: 'text'}},
  });
});

test('dynamic text', t => {
  const node = template('{{this.text}}');
  t.deepEqual(Object.keys(node), ['name', 'attrs']);
  t.deepEqual(Object.keys(node.attrs), ['dynamic']);
  t.true(node.attrs.dynamic.content instanceof Function);
  t.is(node.attrs.dynamic.content.call({text: 'foo'}), 'foo');
});

test('single', t => {
  t.deepEqual(template('<p foo="bar">text.</p>'), {
    name: 'p',
    attrs: {static: {foo: 'bar'}, dynamic: {}, event: {}},
    children: [{name: '#text', attrs: {static: {content: 'text.'}}}],
  });
});

test('multi', t => {
  t.deepEqual(template('<div>text1.</div><div>text2.</div>'), [
    {
      name: 'div',
      attrs: {static: {}, dynamic: {}, event: {}},
      children: [{name: '#text', attrs: {static: {content: 'text1.'}}}],
    },
    {
      name: 'div',
      attrs: {static: {}, dynamic: {}, event: {}},
      children: [{name: '#text', attrs: {static: {content: 'text2.'}}}],
    },
  ]);
});

test('empty tag', t => {
  t.deepEqual(template('<input type="text"><br><hr>'), [
    {
      name: 'input',
      attrs: {static: {type: 'text'}, dynamic: {}, event: {}},
      children: [],
    },
    {
      name: 'br',
      attrs: {static: {}, dynamic: {}, event: {}},
      children: [],
    },
    {
      name: 'hr',
      attrs: {static: {}, dynamic: {}, event: {}},
      children: [],
    },
  ]);
});

test('self close', t => {
  t.deepEqual(template('<ns:tag attr1="foo" attr2="bar"/>'), {
    name: 'ns:tag',
    attrs: {
      dynamic: {},
      event: {},
      static: {attr1: 'foo', attr2: 'bar'},
    },
    children: [],
  });
});
