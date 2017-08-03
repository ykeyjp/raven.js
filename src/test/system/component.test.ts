import test from 'ava';
import Tag from '../../lib/component/Tag';
import component from '../../lib/system/component';
import '../browser';
import {DummyComponent} from './dummy';

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
  t.plan(1);
  t.throws(() => {
    component.tag('app-empty', {});
    component.tag('app-empty', {});
  });
});

test('register empty part', t => {
  const init = () => {};
  component.tag('app0a', {
    css: '',
    init,
    tmpl: '',
  });
  component.tag('app0b', {
    css: '',
    init,
    tmpl: '<div></div>',
  });
  component.tag('app0c', {
    css: ':root{display:none;}',
    init,
    tmpl: '',
  });
  t.deepEqual(component.components.app0a, {Base: Tag, tmpl: [], init});
  t.deepEqual(component.components.app0b, {
    Base: Tag,
    init,
    tmpl: {
      attrs: {static: {}, dynamic: {}, event: {}},
      children: [],
      name: 'div',
    },
  });
  t.deepEqual(component.components.app0c, {Base: Tag, tmpl: [], init});
});

test.serial('register app1', t => {
  const init = () => {};
  component.tag('app1', {
    css: 'h1{color:red;}',
    init,
    tmpl: '<div><h1>Title</h1><p>text.</p></div>',
  });
  t.deepEqual(component.components.app1, {
    Base: Tag,
    init,
    tmpl: {
      attrs: {static: {'data-r-app1': true}, dynamic: {}, event: {}},
      children: [
        {
          attrs: {static: {}, dynamic: {}, event: {}},
          children: [{name: '#text', attrs: {static: {content: 'Title'}, dynamic: {}, event: {}}}],
          name: 'h1',
        },
        {
          attrs: {static: {}, dynamic: {}, event: {}},
          children: [{name: '#text', attrs: {static: {content: 'text.'}, dynamic: {}, event: {}}}],
          name: 'p',
        },
      ],
      name: 'div',
    },
  });
});

test.serial('register app2', t => {
  const init = () => {};
  component.tag('app2', {
    css: ':root{color:red;}',
    init,
    tmpl: '<p>text.</p><p>text.</p>',
  });
  t.deepEqual(component.components.app2, {
    Base: Tag,
    init,
    tmpl: [
      {
        attrs: {static: {'data-r-app2': true}, dynamic: {}, event: {}},
        children: [{name: '#text', attrs: {static: {content: 'text.'}, dynamic: {}, event: {}}}],
        name: 'p',
      },
      {
        attrs: {static: {'data-r-app2': true}, dynamic: {}, event: {}},
        children: [{name: '#text', attrs: {static: {content: 'text.'}, dynamic: {}, event: {}}}],
        name: 'p',
      },
    ],
  });
});

test.serial('register component', t => {
  component.tag('comp', {
    Base: DummyComponent,
  });
  t.true(component.has('comp'));
});

test.serial('mount none', async t => {
  const tag = await component.mount('app0');
  t.deepEqual(tag, []);
});

test.serial('mount', async t => {
  const el = document.querySelector('app1');
  const tag = await component.mount(document.querySelector('app1')!);
  t.false(Array.isArray(tag));
  t.is(el!.outerHTML, '<app1><div data-r-app1="true"><h1>Title</h1><p>text.</p></div></app1>');
});

test.serial('mount nest', async t => {
  component.tag('app3', {
    css: '',
    tmpl: '<div><app3a></app3a></div>',
  });
  component.tag('app3a', {
    css: '',
    tmpl: '<div>app3a</div>',
  });
  const el = document.querySelector('app3');
  const tag = await component.mount(document.querySelectorAll('app3'));
  t.false(Array.isArray(tag));
  t.is(el!.outerHTML, '<app3><div><div>app3a</div></div></app3>');
});
