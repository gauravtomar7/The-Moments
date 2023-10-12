# acquit-ignore

Acquit plugin for removing lines of code from output

[![Build Status](https://travis-ci.org/vkarpov15/acquit-ignore.svg?branch=master)](https://travis-ci.org/vkarpov15/acquit-ignore)
[![Coverage Status](https://coveralls.io/repos/vkarpov15/acquit-ignore/badge.svg?branch=master&service=github)](https://coveralls.io/github/vkarpov15/acquit-ignore?branch=master)

## acquit-ignore

#### It removes code between delimiters

By default, `acquit-ignore` will attach a transform to acquit
that removes any code in a block that's between
'// acquit:ignore:start' and '// acquit:ignore:end'.

```javascript
    const acquit = require('acquit');
require('acquit-ignore')();

var contents = [
  'describe(\'test\', function() {',
  '  it(\'works\', function(done) {',
  '    // acquit:ignore:start',
  '    setup();',
  '    // acquit:ignore:end',
  '    var x = 1;',
  '    // acquit:ignore:start',
  '    assert.equal(x, 1);',
  '    // acquit:ignore:end',
  '',
  '    setTimeout(function() {',
  '      assert.equal(x, 2);',
  '      // acquit:ignore:start',
  '      done();',
  '      // acquit:ignore:end',
  '    }, 0);',
  '    ++x;',
  '  });',
  '});'
].join('\n');

const blocks = acquit.parse(contents);
assert.equal(blocks.length, 1);
assert.equal(blocks[0].blocks[0].contents, 'works');

const expectedCode = [
  'var x = 1;',
  '',
  'setTimeout(function() {',
  '  assert.equal(x, 2);',
  '}, 0);',
  '++x;',
].join('\n');

assert.equal(blocks[0].blocks[0].code, expectedCode);
```

#### It supports custom delimiters

Don't like 'acquit:ignore:start' and 'acquit:ignore:end'?
Set your own by setting the 'start' and 'end' options.

```javascript
    const acquit = require('acquit');
require('acquit-ignore')({
  start: '// bacon',
  end: '// eggs'
});

const contents = [
  'describe(\'test\', function() {',
  '  it(\'works\', function(done) {',
  '    var x = 1;',
  '    // acquit:ignore:start',
  '    assert.equal(x, 1);',
  '    // acquit:ignore:end',
  '',
  '    setTimeout(function() {',
  '      assert.equal(x, 2);',
  '      // bacon',
  '      done();',
  '      // eggs',
  '    }, 0);',
  '    ++x;',
  '  });',
  '});'
].join('\n');

const blocks = acquit.parse(contents);
assert.equal(blocks.length, 1);
assert.equal(blocks[0].blocks[0].contents, 'works');

const expectedCode = [
  'var x = 1;',
  '// acquit:ignore:start',
  'assert.equal(x, 1);',
  '// acquit:ignore:end',
  '',
  'setTimeout(function() {',
  '  assert.equal(x, 2);',
  '}, 0);',
  '++x;'
].join('\n');

assert.equal(blocks[0].blocks[0].code, expectedCode);
```

#### It can accept an acquit instance

By default, acquit-ignore attaches itself to the acquit
singleton. However, you can also attach it to an acquit
instance.

```javascript
    const instance = require('acquit')();
require('acquit-ignore')(instance, {
  start: '// bacon',
  end: '// eggs'
});

const contents = [
  'describe(\'test\', function() {',
  '  it(\'works\', function(done) {',
  '    var x = 1;',
  '    // bacon',
  '    assert.equal(x, 1);',
  '    // eggs',
  '',
  '    setTimeout(function() {',
  '      assert.equal(x, 2);',
  '      // bacon',
  '      done();',
  '      // eggs',
  '    }, 0);',
  '    ++x;',
  '  });',
  '});'
].join('\n');

const blocks = instance.parse(contents);
assert.equal(blocks.length, 1);
assert.equal(blocks[0].blocks[0].contents, 'works');

const expectedCode = [
  'var x = 1;',
  '',
  'setTimeout(function() {',
  '  assert.equal(x, 2);',
  '}, 0);',
  '++x;'
].join('\n');

assert.equal(blocks[0].blocks[0].code, expectedCode);
```

