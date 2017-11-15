const fs = require('fs');

const pkg = require('../package.json');
const finalPkg = {};
const finalKeys = [
  'name',
  'version',
  'author',
  'repository',
  'description',
  'keywords',
  'license',
  'module',
  'es2015',
  'typings',
  'peerDependencies',
];

for (const key of Object.keys(pkg)) {
  if (!finalKeys.includes(key)) {
    continue;
  }
  finalPkg[key] = pkg[key];
}

fs.writeFileSync('./dist/package.json', JSON.stringify(finalPkg, null, 2));
