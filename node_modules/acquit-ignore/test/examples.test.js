'use strict';

const acquit = require('acquit');
const assert = require('assert');

describe('acquit-ignore', function() {
  afterEach(function() {
    acquit.removeAllTransforms();
  });

  /**
   * By default, `acquit-ignore` will attach a transform to acquit
   * that removes any code in a block that's between
   * '// acquit:ignore:start' and '// acquit:ignore:end'.
   */
  it('removes code between delimiters', function() {
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
  });

  /**
   * Don't like 'acquit:ignore:start' and 'acquit:ignore:end'?
   * Set your own by setting the 'start' and 'end' options.
   */
  it('supports custom delimiters', function() {
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
  });

  /**
   * By default, acquit-ignore attaches itself to the acquit
   * singleton. However, you can also attach it to an acquit
   * instance.
   */
  it('can accept an acquit instance', function() {
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
  });
});
