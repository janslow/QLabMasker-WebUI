"use strict";

var Point = require("models/Point");
var RenderMode = require("models/RenderMode");
var CanExecuteResultFactory = require("commands/CanExecuteResultFactory");

var ChangeRenderModeCommand = function (screen, polygon, renderMode) {
  Object.defineProperties(this, {
    screen: {
      value: screen,
      enumerable: true
    },
    polygon: {
      value: polygon,
      enumerable: true
    },
    renderMode: {
      value: renderMode,
      enumerable: true
    }
  });
};

ChangeRenderModeCommand.prototype.canExecute = function () {
  var errorMessages = [];

  if (RenderMode.getValues().indexOf(this.renderMode) < 0) {
    errorMessages += "\"" + this.renderMode + "\" is not a valid render mode; it must be one of the defined modes.";
  }

  if (errorMessages.length) {
    return CanExecuteResultFactory.canNotExecute(errorMessages);
  } else {
    return CanExecuteResultFactory.canExecute(true);
  }
};

ChangeRenderModeCommand.prototype.execute = function () {
  if (!this.canExecute().isExecutable) {
    throw "Command can't be executed.";
  }
  
  var oldRenderMode = this.polygon.renderMode;
  this.polygon.renderMode = this.renderMode;

  return new ChangeRenderModeCommand(this.screen, this.polygon, oldRenderMode);
};

ChangeRenderModeCommand.prototype.getDescription = function () {
  return "Change " + this.polygon + " to " + this.renderMode + " mode.";
};

module.exports = ChangeRenderModeCommand;