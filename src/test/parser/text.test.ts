import test from 'ava';
import text from '../../lib/parser/text';

test('plain', t => {
  t.is(text('text'), 'text');
});

test('simple', t => {
  const f = text('before {{this.text}} after') as Function;
  t.true(f instanceof Function);
  t.is(f.call({text: 'text'}), 'before text after');
  const f2 = text('before {{this.text}}') as Function;
  t.true(f2 instanceof Function);
  t.is(f2.call({text: 'text'}), 'before text');
});
