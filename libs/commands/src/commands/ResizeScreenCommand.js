"use strict";

var CanExecuteResultFactory = require("commands/CanExecuteResultFactory");

var ResizeScreenCommand = function (screen, width, height) {
  Object.defineProperties(this, {
    screen: {
      value: screen,
      enumerable: true
    },
    width: {
      value: width,
      enumerable: true
    },
    height: {
      value: height,
      enumerable: true
    }
  });
};

ResizeScreenCommand.prototype.canExecute = function () {
  var errorMessages = [];

  if (this.width <= 0) {
    errorMessages.push("Width is " + this.width + "; it must be > 0.");
  }
  if (this.height <= 0) {
    errorMessages.push("Height is " + this.height + "; it must be > 0.");
  }

  if (errorMessages.length) {
    return CanExecuteResultFactory.canNotExecute(errorMessages);
  } else {
    return CanExecuteResultFactory.canExecute(true);
  }
};

ResizeScreenCommand.prototype.execute = function () {
  if (!this.canExecute().isExecutable) {
    throw "Command can't be executed.";
  }
  
  var oldWidth = this.screen.width;
  this.screen.width = this.width;

  var oldHeight = this.screen.height;
  this.screen.height = this.height;

  return new ResizeScreenCommand(this.screen, oldWidth, oldHeight);
};

ResizeScreenCommand.prototype.getDescription = function () {
  return "Resize " + this.screen + " to " + this.width + "x" + this.height + ".";
};

module.exports = ResizeScreenCommand;