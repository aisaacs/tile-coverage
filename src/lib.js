
const createLookup = require('xyzpdq');

function split(tile) {
  var nx = tile.x * 2;
  var ny = tile.y * 2;
  var nz = tile.z + 1;
  return [
    {x: nx, y: ny, z: nz},
    {x: nx + 1, y: ny, z: nz},
    {x: nx, y: ny + 1, z: nz},
    {x: nx + 1, y: ny + 1, z: nz}
  ];
}
function check(tile, lookup, maxZoom) {

  let results = [];

  let zDelta = maxZoom - tile.z ;
  let zoomFactor = Math.pow(2, zDelta);
  let worldSize = Math.pow(2, maxZoom);

  let minX = tile.x * zoomFactor;
  let maxX = (tile.x + 1) * zoomFactor - 1;
  let maxY = worldSize - 1 - (tile.y * zoomFactor);
  let minY = worldSize - 1 - ((tile.y + 1) * zoomFactor - 1);

  let contains = lookup.contains(minX, minY, maxX, maxY, maxZoom)

  if (contains === createLookup.ALL) {
    results.push(tile);
  } else if (contains === createLookup.SOME) {
    let subTiles = split(tile);
    subTiles.forEach(subTile => {
      results = results.concat(check(subTile, lookup, maxZoom));
    });
  }

  return results;
}
function main(feature, maxZoom) {
  var base  = {x: 0, y : 0, z: 0};
  let lookup = createLookup(feature);
  return check(base, lookup, maxZoom);
}

module.exports = main;
