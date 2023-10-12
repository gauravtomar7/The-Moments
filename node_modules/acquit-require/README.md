# acquit-require

Utility to pull mocha tests into markdown, HTML, etc.


# transform()


This is the function you want to use. Given a string
(markdown, HTML, Jade, etc.) and the raw source code of some mocha tests,
this function returns a string with `[require:bar]` replaced with the
source code of the first test that matches the regexp 'bar'.

Given the below markdown `article`:

    Printing "Hello, World" in JavaScript is easy:
    
    ```
    [require:bar]
    ```
    
    This is how you print "Bye!" instead:
    
    ```
    [require:baz]
    ```
    

And the below mocha test `code`:

```javascript
describe('foo', function() {
  it('bar', function() {
    console.log('Hello, World!');
  });

  it('baz', function() {
    console.log('Bye!');
  });
});

```

The `transform()` function will pull the source code of the two tests into
your markdown file.


```javascript

  const output = transform(article, code);

  const logStatements = output.match(/console\.log(.*);/g);

  assert.ok(logStatements);
  assert.equal(logStatements[0].trim(), `console.log('Hello, World!');`);
  assert.equal(logStatements[1].trim(), `console.log('Bye!');`);

```

# findTest()

```javascript

  assert.equal(findTest('foo', code).trim(),
    `console.log('Hello, World!');`);
  assert.equal(findTest('bar', code).trim(),
    `console.log('Hello, World!');`);
  assert.equal(findTest('foo bar', code).trim(),
    `console.log('Hello, World!');`);
  assert.equal(findTest('baz', code).trim(),
    `console.log('Bye!');`);
  assert.ok(!findTest('bar baz', code));

```
