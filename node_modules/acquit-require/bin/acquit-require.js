#!/usr/bin/node

'use strict';

const acquit = require('acquit');
const assert = require('assert');
const commander = require('commander');
const fs = require('fs');
const transform = require('../');

commander.
  option('-p, --path [path]', 'Path to text file').
  option('-r, --require [plugin]', 'Require plugins').
  option('-t, --test [path]', 'Path to test file').
  parse(process.argv);

assert.ok(commander.path, 'Need to set --path option!');
assert.ok(commander.test, 'Need to set --test option!');

const text = fs.readFileSync(commander.path).toString();
const tests = fs.readFileSync(commander.test).toString();

console.log(transform(text, acquit.parse(tests)));
