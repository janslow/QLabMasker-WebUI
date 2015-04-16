"use strict";

var Point = require("models/Point");
var CanExecuteResultFactory = require("commands/CanExecuteResultFactory");

var InsertPointCommand = function (screen, polygon, x, y, position) {
  var point = new Point(x, y);

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
    },
    position: {
      value: position,
      enumerable: true
    }
  });
};

InsertPointCommand.prototype.canExecute = function () {
  var errorMessages = [];
  if (this.point.x < 0 || this.point.x >= this.screen.width) {
    errorMessages.push("x position is " + this.point.x + "; it must be >= 0 and < screen width.");
  }
  if (this.point.y < 0 || this.point.y >= this.screen.height) {
    errorMessages.push("y position is " + this.point.y + "; it must be >= 0 and < screen height.");
  }
  if (this.position < 0 || this.position > this.polygon.points.length) {
    errorMessages.push("Insertion position is " + this.position + "; it must be between 0 and the number of points in the polygon.");
  }
  if (this.polygon.indexOf(this.point) >= 0) {
    errorMessages.push(this.point + " is already in " + this.polygon + "; duplicate points are not allowed.");
  }

  if (errorMessages.length) {
    return CanExecuteResultFactory.canNotExecute(errorMessages);
  } else {
    return CanExecuteResultFactory.canExecute(true);
  }
};

InsertPointCommand.prototype.execute = function () {
  if (!this.canExecute().isExecutable) {
    throw "Command can't be executed.";
  }
  this.polygon.points.splice(this.position, 0, this.point);

  var RemovePointCommand = require("commands/RemovePointCommand");
  return new RemovePointCommand(this.screen, this.polygon, this.point);
};

InsertPointCommand.prototype.getDescription = function () {
  return "Add " + this.point + " to " + this.polygon + ".";
};
InsertPointCommand.prototype.toString = function () {
  return "InsertPointCommand(" + this.screen + ", " + this.polygon + ", " + this.point + " @ " + this.position + ")";
}

module.exports = InsertPointCommand;