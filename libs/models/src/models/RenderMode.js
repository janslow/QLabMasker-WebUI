"use strict";

var renderModes = ["ADD", "SUBTRACT"]

var RenderMode = function () {
  for (var i in renderModes) {
    var renderMode = renderModes[i];
    Object.defineProperty(this, renderMode, {
      value: renderMode,
      enumerable: true
    });
    Object.defineProperty(this, i, {
      value: renderMode
    });
  }
}
RenderMode.prototype.getValueOf = function (renderMode) {
  return renderModes.indexOf(renderMode);
}
RenderMode.prototype.getValues = function () {
  return renderModes.slice();
}

module.exports = new RenderMode();