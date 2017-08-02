import test from 'ava';
import wrap from '../../lib/parser/wrap';

test('empty', t => {
  t.is(wrap(''), '');
});

test('normal text', t => {
  t.is(wrap('text'), 'text');
});

test('$', t => {
  t.is(wrap('$item'), 'this.$.item');
});

test('$$', t => {
  t.is(wrap('$$item'), 'this.$$.item');
});

test('$$$', t => {
  t.is(wrap('$$$item'), 'this.$$$.item');
});

test('with single quote', t => {
  t.is(wrap("text['$']"), "text['$']");
});

test('with double quote', t => {
  t.is(wrap('text["$"]'), 'text["$"]');
});
