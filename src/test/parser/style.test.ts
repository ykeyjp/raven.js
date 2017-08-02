import test from 'ava';
import style from '../../lib/parser/style';

test('selector + rules', t => {
  t.deepEqual(style('app', ':root { display:block; }'), [{type: 'rule', selector: '[app]', rules: 'display:block;'}]);
});

test('media + selector + rules', t => {
  t.deepEqual(style('app', '@media screen { a { display:block; } }'), [
    {
      media: 'screen',
      selectors: [
        {
          rules: 'display:block;',
          selector: '[app] a',
          type: 'rule',
        },
      ],
      type: 'media',
    },
  ]);
});

test('error', t => {
  t.throws(() => {
    style('app', '@media screen { }} }');
  });
  t.throws(() => {
    style('app', ':root {');
  });
});
