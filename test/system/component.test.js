import test from 'ava';
import component from '../../lib/system/component';
import Tag from '../../lib/component/tag';

require('browser-env')();

test.before(() => {
  document.body.innerHTML = `
    <app0></app0>
    <app1></app1>
    <app2></app2>
    <app3></app3>
    <app4></app4>
    <app5></app5>
    <app6></app6>
    <app7></app7>
    <app8></app8>
    <app9></app9>
    <app10></app10>
  `;
});

test('register error', t => {
  t.plan(2);
  t.throws(() => {
    component.tag('app-error');
  });
  t.throws(() => {
    component.tag('app-empty', {tmpl: ''});
    component.tag('app-empty', {tmpl: ''});
  });
});

test('register empty part', t => {
  const init = () => {};
  component.tag('app0a', {
    tmpl: '',
    css: '',
    init,
  });
  component.tag('app0b', {
    tmpl: '<div></div>',
    css: '',
    init,
  });
  component.tag('app0c', {
    tmpl: '',
    css: ':root{display:none;}',
    init,
  });
  t.deepEqual(component.components.app0a, {base: Tag, tmpl: [], init});
  t.deepEqual(component.components.app0b, {
    base: Tag,
    tmpl: {
      name: 'div',
      attrs: {static: {}, dynamic: {}, event: {}},
      children: [],
    },
    init,
  });
  t.deepEqual(component.components.app0c, {base: Tag, tmpl: [], init});
});

test.serial('register app1', t => {
  const init = () => {};
  component.tag('app1', {
    tmpl: '<div><h1>Title</h1><p>text.</p></div>',
    css: 'h1{color:red;}',
    init,
  });
  t.deepEqual(component.components.app1, {
    base: Tag,
    tmpl: {
      name: 'div',
      attrs: {static: {'data-r-app1': true}, dynamic: {}, event: {}},
      children: [
        {
          name: 'h1',
          attrs: {static: {}, dynamic: {}, event: {}},
          children: [{name: '#text', attrs: {static: {content: 'Title'}}}],
        },
        {
          name: 'p',
          attrs: {static: {}, dynamic: {}, event: {}},
          children: [{name: '#text', attrs: {static: {content: 'text.'}}}],
        },
      ],
    },
    init,
  });
});

test.serial('register app2', t => {
  const init = () => {};
  component.tag('app2', {
    tmpl: '<p>text.</p><p>text.</p>',
    css: ':root{color:red;}',
    init,
  });
  t.deepEqual(component.components.app2, {
    base: Tag,
    tmpl: [
      {
        name: 'p',
        attrs: {static: {'data-r-app2': true}, dynamic: {}, event: {}},
        children: [{name: '#text', attrs: {static: {content: 'text.'}}}],
      },
      {
        name: 'p',
        attrs: {static: {'data-r-app2': true}, dynamic: {}, event: {}},
        children: [{name: '#text', attrs: {static: {content: 'text.'}}}],
      },
    ],
    init,
  });
});

test.serial('register component', t => {
  class ComponentClass {}
  component.tag('comp', {
    base: ComponentClass,
  });
  t.true(component.has('comp'));
});

test.serial('mount none', async t => {
  const tag = await component.mount('app0');
  t.is(tag, null);
});

test.serial('mount', async t => {
  const el = document.querySelector('app1');
  const tag = await component.mount(document.querySelector('app1'));
  t.false(Array.isArray(tag));
  t.is(
    el.outerHTML,
    '<app1><div data-r-app1="true"><h1>Title</h1><p>text.</p></div></app1>'
  );
});

test.serial('mount nest', async t => {
  component.tag('app3', {
    tmpl: '<div><app3a></app3a></div>',
    css: '',
  });
  component.tag('app3a', {
    tmpl: '<div>app3a</div>',
    css: '',
  });
  const el = document.querySelector('app3');
  const tag = await component.mount(document.querySelectorAll('app3'));
  t.false(Array.isArray(tag));
  t.is(el.outerHTML, '<app3><div><div>app3a</div></div></app3>');
});
