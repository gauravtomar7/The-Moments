'use strict';

const assert = require('assert');
const fs = require('fs');
const transform = require('../');

const findTest = transform.findTest;

const article = fs.readFileSync('./test/data/article.md', 'utf8');
const code = fs.readFileSync('./test/data/simple.js', 'utf8');

/**
 * This is the function you want to use. Given a string
 * (markdown, HTML, Jade, etc.) and the raw source code of some mocha tests,
 * this function returns a string with `[require:bar]` replaced with the
 * source code of the first test that matches the regexp 'bar'.
 *
 * Given the below markdown `article`:
 *
 * [markdown]
 *
 * And the below mocha test `code`:
 *
 * ```javascript
 * [code]
 * ```
 *
 * The `transform()` function will pull the source code of the two tests into
 * your markdown file.
 */

it('transform()', function() {
  const output = transform(article, code);

  const logStatements = output.match(/console\.log(.*);/g);

  assert.ok(logStatements);
  assert.equal(logStatements[0].trim(), `console.log('Hello, World!');`);
  assert.equal(logStatements[1].trim(), `console.log('Bye!');`);
});

it('findTest()', function() {
  assert.equal(findTest('foo', code).trim(),
    `console.log('Hello, World!');`);
  assert.equal(findTest('bar', code).trim(),
    `console.log('Hello, World!');`);
  assert.equal(findTest('foo bar', code).trim(),
    `console.log('Hello, World!');`);
  assert.equal(findTest('baz', code).trim(),
    `console.log('Bye!');`);
  assert.ok(!findTest('bar baz', code));
});
