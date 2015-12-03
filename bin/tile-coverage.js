#! /usr/bin/env node

var fs = require('fs');
var tileCoverage = require('../src/lib.js');
var argv = require('yargs')
    .usage('Usage: $0 -a [geojson] -o [output file] -z [zoomlevel]')
    .demand(['a', 'o'])
    .argv;

var maxZoom = argv.z || 15;

var area = JSON.parse(fs.readFileSync(argv.a));
if (area.type === 'FeatureCollection') {
  area = area.features[0];
}

if (!area) {
  console.error('No area specified');
  process.exit(-1);
}

console.log('Starting');

var list = tileCoverage(area, maxZoom);

console.log('Sorting');

list.sort(function(a, b) {
  return a.z - b.z;
});

console.log('Writing list (length: ', list.length, ')');

require('fs').writeFileSync(argv.o, JSON.stringify(list));

console.log('Done');
