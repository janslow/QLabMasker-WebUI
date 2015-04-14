"use strict";

var Screen = function (width, height, polygons) {
  if (arguments.length == 2) {
    polygons = [];
  }

  Object.defineProperties(this, {
    width: {
      value: width,
      enumerable: true,
      writable: true
    },
    height: {
      value: height,
      enumerable: true,
      writable: true
    },
    polygons: {
      value: polygons,
      enumerable: true,
      writable: true
    }
  });
};

Screen.prototype.toString = function() {
  return "Screen(" + this.width + "x" + this.height + ")";
};

module.exports = Screen;