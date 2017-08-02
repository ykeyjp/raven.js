import test from 'ava';
import attribute from '../../lib/parser/attribute';

test('flag', t => {
  t.deepEqual(attribute('foo bar foobar'), {
    dynamic: {},
    event: {},
    static: {
      bar: true,
      foo: true,
      foobar: true,
    },
  });
});

test('name:value', t => {
  t.deepEqual(attribute('foo="fooVal" bar="barVal"'), {
    dynamic: {},
    event: {},
    static: {
      bar: 'barVal',
      foo: 'fooVal',
    },
  });
});

test('value with escape', t => {
  t.deepEqual(attribute('foo="foo\\"val" bar=\'bar\\\'val\''), {
    dynamic: {},
    event: {},
    static: {
      bar: "bar'val",
      foo: 'foo"val',
    },
  });
});

test('valur with null and undefined', t => {
  t.deepEqual(attribute('null0="null" undefined0="undefined"'), {
    dynamic: {},
    event: {},
    static: {
      null0: null,
      undefined0: undefined,
    },
  });
});

test('valur with bool', t => {
  t.deepEqual(attribute('true0="true" false0="false"'), {
    dynamic: {},
    event: {},
    static: {
      false0: false,
      true0: true,
    },
  });
});

test('valur with number', t => {
  t.deepEqual(attribute('integer="10" float="0.5"'), {
    dynamic: {},
    event: {},
    static: {
      float: 0.5,
      integer: 10,
    },
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
  t.is(attrs.dynamic.foo!.call({bar: 'foo'}), 'foo');
});

test('event', t => {
  const attrs = attribute('@click="this.click"');
  t.deepEqual(Object.keys(attrs), ['static', 'dynamic', 'event']);
  t.deepEqual(Object.keys(attrs.event), ['click']);
  t.true(attrs.event.click instanceof Function);
  attrs.event.click.call({
    click(e: any) {
      e.skipUpdate = true;
      t.pass();
    },
  });
});
