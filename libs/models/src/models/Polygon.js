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

module.exports = Polygon;