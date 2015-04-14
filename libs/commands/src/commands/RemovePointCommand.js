"use strict";

var Point = require("models/Point");
var CanExecuteResultFactory = require("commands/CanExecuteResultFactory");

var RemovePointCommand = function (screen, polygon, point, position) {
  Object.defineProperties(this, {
    screen: {
      value: screen,
      enumerable: true
    },
    polygon: {
      value: polygon,
      enumerable: true
    },
    point: {
      value: point,
      enumerable: true
    }
  });
};

RemovePointCommand.prototype.canExecute = function () {
  var errorMessages = [];

  if (this.polygon.indexOf(this.point) < 0) {
    errorMessages.push("Can't find " + this.point + " in " + this.polygon + "; polygon must contain point to remove.");
  }

  if (errorMessages.length) {
    return CanExecuteResultFactory.canNotExecute(errorMessages);
  } else {
    return CanExecuteResultFactory.canExecute(true);
  }
};

RemovePointCommand.prototype.execute = function () {
  if (!this.canExecute().isExecutable) {
    throw "Command can't be executed.";
  }
  
  var position = this.polygon.indexOf(this.point);
  this.polygon.points.splice(position, 1);

  var InsertPointCommand = require("commands/InsertPointCommand");
  return new InsertPointCommand(this.screen, this.polygon, this.point.x, this.point.y, position);
};

RemovePointCommand.prototype.getDescription = function () {
  return "Remove " + this.point + " from " + this.polygon + ".";
};

module.exports = RemovePointCommand;