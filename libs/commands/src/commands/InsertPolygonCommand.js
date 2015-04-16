"use strict";

var CanExecuteResultFactory = require("commands/CanExecuteResultFactory");
var Polygon = require("models/Polygon");
var RenderMode = require("models/RenderMode");
var RemovePolygonCommand = require("commands/RemovePolygonCommand");

var InsertPolygonCommand = function (screen, name, renderMode, position) {
  var polygon = new Polygon(name, renderMode);

  Object.defineProperties(this, {
    screen: {
      value: screen,
      enumerable: true
    },
    polygon: {
      value: polygon,
      enumerable: true
    },
    position: {
      value: position,
      enumerable: true
    }
  });
};

InsertPolygonCommand.prototype.canExecute = function () {
  var errorMessages = [];

  var nameLength = this.polygon.name.length;
  if (nameLength == 0) {
    errorMessages.push("Name is blank; a polygon must have a name.")
  }
  if (nameLength  > 20) {
    errorMessages.push("Name is " + nameLength + " characters long; it must be <= 20 characters.");
  }
  if (RenderMode.getValues().indexOf(this.polygon.renderMode) < 0) {
    errorMessages.push("Render mode (" + this.polygon.renderMode + ") is unknown; it must be a valid mode.")
  }
  if (this.position < 0 || this.position > this.screen.polygons.length) {
    errorMessages.push("Insertion position is " + this.position + "; it must be between 0 and the number of polygons in the screen.");
  }
  if (this.screen.indexOf(this.polygon) >= 0) {
    errorMessages.push(this.polygon + " is already in " + this.screen + "; duplicate polygons are not allowed.");
  }

  if (errorMessages.length) {
    return CanExecuteResultFactory.canNotExecute(errorMessages);
  } else {
    return CanExecuteResultFactory.canExecute(true);
  }
};

InsertPolygonCommand.prototype.execute = function () {
  if (!this.canExecute().isExecutable) {
    throw "Command can't be executed.";
  }
  this.screen.polygons.splice(this.position, 0, this.polygon);

  return new RemovePolygonCommand(this.screen, this.polygon);
};

InsertPolygonCommand.prototype.getDescription = function () {
  return "Add " + this.polygon + " to " + this.screen + ".";
};
InsertPolygonCommand.prototype.toString = function () {
  return "InsertPolygonCommand(" + this.screen + ", " + this.polygon + " @ " + this.position + ")";
}

module.exports = InsertPolygonCommand;