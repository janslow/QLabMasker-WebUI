"use strict";

var Polygon = function (name, renderMode, points) {
  if (arguments.length == 2) {
    points = [];
  }

  Object.defineProperties(this, {
    name: {
      value: name,
      enumerable: true,
      writable: true
    },
    renderMode: {
      value: renderMode,
      enumerable: true,
      writable: true
    },
    points: {
      value: points,
      enumerable: true,
      writable: true
    }
  });
};

Polygon.prototype.indexOf = function(point) {
  for (var i = this.points.length - 1; i >= 0; i--) {
    var p = this.points[i];
    if (point.x == p.x && point.y == p.y) {
      return i;
    }
  };
  return -1;
};
Polygon.prototype.toString = function() {
  return "Polygon(" + this.name + ")";
};

module.exports = Polygon;