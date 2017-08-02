import test from 'ava';
import putNodes from '../../lib/util/putNodes';
import '../browser';

test('skip', t => {
  const el = document.createElement('div');
  putNodes(el, null);
  t.is(el.children.length, 0);
});

test('append', t => {
  const parent = document.createElement('div');
  const child = document.createElement('div');
  putNodes(parent, child);
  t.is(parent.children.length, 1);
  putNodes(parent, child);
  t.is(parent.children.length, 1);
});
