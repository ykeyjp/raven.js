import test from 'ava';
import attribute from '../../lib/parser/attribute';

test('flag', t => {
  t.deepEqual(attribute('foo bar foobar'), {
    static: {
      foo: true,
      bar: true,
      foobar: true,
    },
    dynamic: {},
    event: {},
  });
});

test('name:value', t => {
  t.deepEqual(attribute('foo="fooVal" bar="barVal"'), {
    static: {
      foo: 'fooVal',
      bar: 'barVal',
    },
    dynamic: {},
    event: {},
  });
});

test('value with escape', t => {
  t.deepEqual(attribute('foo="foo\\"val" bar=\'bar\\\'val\''), {
    static: {
      foo: 'foo"val',
      bar: "bar'val",
    },
    dynamic: {},
    event: {},
  });
});

test('valur with null and undefined', t => {
  t.deepEqual(attribute('null0="null" undefined0="undefined"'), {
    static: {
      null0: null,
      undefined0: undefined,
    },
    dynamic: {},
    event: {},
  });
});

test('valur with bool', t => {
  t.deepEqual(attribute('true0="true" false0="false"'), {
    static: {
      true0: true,
      false0: false,
    },
    dynamic: {},
    event: {},
  });
});

test('valur with number', t => {
  t.deepEqual(attribute('integer="10" float="0.5"'), {
    static: {
      integer: 10,
      float: 0.5,
    },
    dynamic: {},
    event: {},
  });
});

test('error', t => {
  t.throws(() => {
    attribute('...');
  });
});

test('dynamic', t => {
  const attrs = attribute(':foo="this.bar"');
  t.deepEqual(Object.keys(attrs), ['static', 'dynamic', 'event']);
  t.deepEqual(Object.keys(attrs.dynamic), ['foo']);
  t.true(attrs.dynamic.foo instanceof Function);
  t.is(attrs.dynamic.foo.call({bar: 'foo'}), 'foo');
});

test('event', t => {
  const attrs = attribute('@click="this.click"');
  t.deepEqual(Object.keys(attrs), ['static', 'dynamic', 'event']);
  t.deepEqual(Object.keys(attrs.event), ['click']);
  t.true(attrs.event.click instanceof Function);
  attrs.event.click.call({
    click(e) {
      e.skipUpdate = true;
      t.pass();
    },
  });
});
