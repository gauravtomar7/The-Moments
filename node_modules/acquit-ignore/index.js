'use strict';

const Archetype = require('archetype');

const OptionsType = new Archetype({
  start: {
    $type: 'string',
    $default: '// acquit:ignore:start'
  },
  end: {
    $type: 'string',
    $default: '// acquit:ignore:end'
  }
}).compile('OptionsType');

module.exports = function(parser, options) {
  if (!parser) {
    parser = require('acquit');
  } else if (parser.constructor.name === 'Object') {
    options = parser;
    parser = require('acquit');
  }

  options = new OptionsType(options || {});

  const startsWithRegexp = new RegExp('^' + options.start + '[\\s\\S]*?' +
    options.end + '\n?', 'g');
  const inlineRegexp = new RegExp('[\\s]*' + options.start + '[\\s\\S]*?' +
    options.end, 'g');

  parser.transform(function(block) {
    block.code = block.code.
      replace(startsWithRegexp, '').
      replace(inlineRegexp, '');
  });
};
