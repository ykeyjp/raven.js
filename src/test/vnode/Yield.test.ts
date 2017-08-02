import test from 'ava';
import {IComponent} from '../../lib/types/IComponent';
import Yield from '../../lib/vnode/Yield';
import '../browser';
import {DummyComponent} from './dummy';

test('simple', async t => {
  const tag = new DummyComponent();
  const vnode = new Yield(tag);
  const nodes1 = await vnode.render();
  t.deepEqual(nodes1, []);
  tag.$yield = document.createElement('div');
  const nodes2 = await vnode.render();
  t.true(nodes2 instanceof HTMLDivElement);
});

test('dispose', t => {
  const tag = new DummyComponent();
  const vnode = new Yield(tag);
  t.notThrows(() => {
    vnode.dispose();
  });
});
