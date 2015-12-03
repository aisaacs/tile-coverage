var turf = require('turf');;
var SphericalMercator = require('sphericalmercator');
var same = require('deep-equal');

var area = null;
var maxZoom = null;
var sm = new SphericalMercator({
    size: 256
});
var list = [];

function addQuadTree(tile) {
  list.push(tile);
  if (tile.z < maxZoom) {
    var subTiles = split(tile);
    subTiles.forEach(addQuadTree);
  }
}

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

function check(tile) {
  var bbox = sm.bbox(tile.x, tile.y, tile.z);
  var tilePoly = turf.bboxPolygon(bbox);
  var intersection = turf.intersect(tilePoly, area);

  if (intersection) {
    if (same(turf.extent(intersection), turf.extent(tilePoly))) {
      //the whole tile is included. Add the quadtree
      addQuadTree(tile);
    } else {
      list.push(tile);
      //check each sub tile
      if (tile.z < maxZoom) {
        var subTiles = split(tile);
        subTiles.forEach(check);
      }
    }
  }
}


function main(a, z) {
  area = a;
  maxZoom = z;
  list = [];
  var base  = {x: 0, y : 0, z: 0};
  check(base);
  return list;
}

module.exports = main;
