"use strict";

var Point = require("models/Point");
var RemovePointCommand = require("commands/RemovePointCommand");
var InsertPointCommand = require("commands/InsertPointCommand");
var CanExecuteResultFactory = require("commands/CanExecuteResultFactory");

var ReplacePointCommand = function (screen, polygon, oldPoint, x, y) {
  var newPoint = new Point(x, y);

  Object.defineProperties(this, {
    screen: {
      value: screen,
      enumerable: true
    },
    polygon: {
      value: polygon,
      enumerable: true
    },
    oldPoint: {
      value: oldPoint,
      enumerable: true
    },
    newPoint: {
      value: newPoint,
      enumerable: true
    }
  });
};

ReplacePointCommand.prototype.canExecute = function () {
  var errorMessages = [];

  if (this.newPoint.x < 0 || this.newPoint.x >= this.screen.width) {
    errorMessages.push("New x position is " + this.newPoint.x + "; it must be >= 0 and < screen width.");
  }
  if (this.newPoint.y < 0 || this.newPoint.y >= this.screen.height) {
    errorMessages.push("New y position is " + this.newPoint.y + "; it must be >= 0 and < screen height.");
  }
  if (this.polygon.indexOf(this.newPoint) >= 0) {
    errorMessages.push(this.newPoint + " is already in " + this.polygon + "; duplicate points are not allowed.");
  }
  var position = this.polygon.indexOf(this.oldPoint);
  if (position < 0) {
    errorMessages.push("Can't find " + this.oldPoint + " in " + this.polygon +"; polygon must contain old point.");
  }

  if (errorMessages.length) {
    return CanExecuteResultFactory.canNotExecute(errorMessages);
  } else {
    var removePointCommand = new RemovePointCommand(this.screen, this.polygon, this.oldPoint);
    var insertPointCommand = new InsertPointCommand(this.screen, this.polygon, this.newPoint.x, this.newPoint.y, position);
    return CanExecuteResultFactory.aggregate(removePointCommand.canExecute(), insertPointCommand.canExecute());
  }
};

ReplacePointCommand.prototype.execute = function () {
  if (!this.canExecute().isExecutable) {
    throw "Command can't be executed.";
  }
  var removePointCommand = new RemovePointCommand(this.screen, this.polygon, this.oldPoint);
  var position = removePointCommand.execute().position;

  var insertPointCommand = new InsertPointCommand(this.screen, this.polygon, this.newPoint.x, this.newPoint.y, position);
  insertPointCommand.execute();
  return new ReplacePointCommand(this.screen, this.polygon, this.newPoint, this.oldPoint.x, this.oldPoint.y);
};

ReplacePointCommand.prototype.getDescription = function () {
  return "Replace " + this.oldPoint + " in " + this.polygon + " with " + this.newPoint + ".";
};

module.exports = ReplacePointCommand;