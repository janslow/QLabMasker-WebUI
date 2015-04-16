"use strict";

var Polygon = require("models/Polygon");
var CanExecuteResultFactory = require("commands/CanExecuteResultFactory");

var RemovePolygonCommand = function (screen, polygon) {
  Object.defineProperties(this, {
    screen: {
      value: screen,
      enumerable: true
    },
    polygon: {
      value: polygon,
      enumerable: true
    }
  });
};

RemovePolygonCommand.prototype.canExecute = function () {
  var errorMessages = [];

  if (this.screen.indexOf(this.polygon) < 0) {
    errorMessages.push("Can't find " + this.polygon + " in " + this.screen + "; screen must contain polygon to remove.");
  }

  if (errorMessages.length) {
    return CanExecuteResultFactory.canNotExecute(errorMessages);
  } else {
    return CanExecuteResultFactory.canExecute(false);
  }
};

RemovePolygonCommand.prototype.execute = function () {
  if (!this.canExecute().isExecutable) {
    throw "Command can't be executed.";
  }
  
  var position = this.screen.indexOf(this.polygon);
  this.screen.polygons.splice(position, 1);

  return null;
};

RemovePolygonCommand.prototype.getDescription = function () {
  return "Remove " + this.polygon + " from " + this.screen + ".";
};

module.exports = RemovePolygonCommand;