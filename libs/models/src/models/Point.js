"use strict";

var Point = function (x, y) {
  Object.defineProperties(this, {
    x: {
      value: x,
      enumerable: true,
      writable: true
    },
    y: {
      value: y,
      enumerable: true,
      writable: true
    }
  });
};

module.exports = Point;