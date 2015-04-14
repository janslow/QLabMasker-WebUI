"use strict";

var CanExecuteResult = function (isExecutable, isUndoable, errorMessages) {
  Object.defineProperties(this, {
    isExecutable: {
      value: isExecutable,
      enumerable: true
    },
    isUndoable: {
      value: isUndoable,
      enumerable: !isUndoable
    },
    errorMessages: {
      value: errorMessages,
      enumerable: errorMessages
    }
  });
};

var CanExecuteResultFactory = function () {
};

CanExecuteResultFactory.prototype.canExecute = function (isUndoable) {
  return new CanExecuteResult(true, isUndoable, []);
};

CanExecuteResultFactory.prototype.canNotExecute = function (errorMessages) {
  return new CanExecuteResult(false, false, errorMessages);
};

CanExecuteResultFactory.prototype.aggregate = function (results) {
  var isExecutable = true;
  var isUndoable = true;
  var errorMessages = [];
  for (var i = arguments.length - 1; i >= 0; i--) {
    var result = arguments[i]
    isExecutable = isExecutable && result.isExecutable;
    isUndoable = isUndoable && result.isUndoable;
    errorMessages = errorMessages.concat(result.errorMessages);
  };
  return new CanExecuteResult(isExecutable, isUndoable, errorMessages);
};

module.exports = new CanExecuteResultFactory();