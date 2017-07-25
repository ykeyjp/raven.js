import test from 'ava';
import Yield from '../../lib/vnode/yield';

require('browser-env')();

test('simple', async t => {
  const tag = {};
  const vnode = new Yield(tag);
  const nodes1 = await vnode.render();
  t.deepEqual(nodes1, []);
  tag.$yield = document.createElement('div');
  const nodes2 = await vnode.render();
  t.true(nodes2 instanceof HTMLDivElement);
});

test('dispose', t => {
  const vnode = new Yield();
  t.notThrows(() => {
    vnode.dispose();
  });
});
