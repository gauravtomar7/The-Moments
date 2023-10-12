const fs = require('fs');

let readme = fs.readFileSync('./README.md', 'utf8');

const md = fs.readFileSync('./test/data/article.md').
  toString().
  split('\n').
  map(line => `    ${line}`).
  join('\n');
readme = readme.replace('[markdown]', md);
readme = readme.replace('[code]', fs.readFileSync('./test/data/simple.js'));

fs.writeFileSync('./README.md', readme);
