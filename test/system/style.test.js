import test from 'ava';
import style from '../../lib/system/style';

require('browser-env')();

test('generate scope', t => {
  t.is(style.generate('app'), 'data-r-app');
});

test.serial('stylesheet', t => {
  const sheet = style.stylesheet();
  t.true(sheet instanceof CSSStyleSheet);
});

test.serial('stylesheet with ref="raven"', t => {
  style.env.sheet = null;
  const tag = document.createElement('style');
  tag.type = 'text/css';
  tag.setAttribute('rel', 'raven');
  document.querySelector('head').appendChild(tag);
  document.styleSheets[0].ownerNode = tag;
  const sheet = style.stylesheet();
  t.true(sheet instanceof CSSStyleSheet);
  sheet.insertRule('div{display:none;}', 0);
  sheet.insertRule('@media screen{div{display:none;}}', 0);
});

test.serial('register + unregister', t => {
  const sheet = style.stylesheet();
  style.register('app', [
    {
      selector: 'p',
      rules: 'color:red;',
    },
  ]);
  t.is(sheet.cssRules.length, 3);
  t.is(sheet.cssRules[2].selectorText, 'p');
  style.unregister('app');
  style.unregister('app-not-exists');
  t.is(sheet.cssRules.length, 2);
});

test('register + unregister with media', t => {
  const sheet = style.stylesheet();
  style.register('app', [
    {
      media: 'screen and (min-width:480px)',
      selectors: [
        {
          selector: 'p',
          rules: 'color:red;',
        },
      ],
    },
  ]);
  t.is(sheet.cssRules.length, 3);
  t.is(sheet.cssRules[2].media[0], 'screen and (min-width:480px)');
  style.unregister('app');
  style.unregister('app-not-exists');
  t.is(sheet.cssRules.length, 2);
});
