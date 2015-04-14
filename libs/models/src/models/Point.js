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

module.exports = Point;