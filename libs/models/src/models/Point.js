"use strict";

var Point = function (x, y) {
  Object.defineProperties(this, {
    x: {
      value: x,
      enumerable: true
    },
    y: {
      value: y,
      enumerable: true
    }
  });
};

Point.prototype.toString = function () {
  return "Point(" + this.x + ", " + this.y + ")";
};

module.exports = Point;