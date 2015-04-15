(function(){
  "use strict";
  
  var ResizeScreenCommandClassTest = TestCase("ResizeScreenCommandClassTest");
  
  var ResizeScreenCommand = require("commands/ResizeScreenCommand");

  var Screen = require("models/Screen");
  
  ResizeScreenCommandClassTest.prototype.testIsClass = function () {
    assertTypeOf("function", ResizeScreenCommand);
  };
  ResizeScreenCommandClassTest.prototype.testConstructor = function () {
    var screen = new Screen(100, 101);
    var width = 234;
    var height = 567;
    
    var toTest = new ResizeScreenCommand(screen, width, height);

    assertTrue(toTest instanceof ResizeScreenCommand);
    assertEquals("Assert screen:", screen, toTest.screen);
    assertEquals("Assert width:", width, toTest.width);
    assertEquals("Assert height:", height, toTest.height);
  };
  ResizeScreenCommandClassTest.prototype.testGetDescription = function () {
    var toTest = new ResizeScreenCommand(new Screen(123, 456), 531, 642);

    assertEquals("Resize Screen(123x456) to 531x642.", toTest.getDescription());
  };

  ResizeScreenCommandClassTest.prototype.testExecute = function () {
    var oldWidth = 123;
    var oldHeight = 456;
    var screen = new Screen(oldWidth, oldHeight);

    var width = 10;
    var height = 10;

    var toTest = new ResizeScreenCommand(screen, width, height);

    assertEquals(width, toTest.width);
    assertEquals(height, toTest.height);

    var undoCommand = toTest.execute();

    assertEquals("Expected screen to change width:", width, screen.width);
    assertEquals("Expected screen to change height:", height, screen.height);
    
    assertTrue("Expected a ResizeScreenCommand to be provided to undo execution:", undoCommand instanceof ResizeScreenCommand);
    assertEquals("Expected correct screen in undo command:", screen, undoCommand.screen);
    assertEquals("Expected correct width in undo command:", oldWidth, undoCommand.width);
    assertEquals("Expected correct height in undo command:", oldHeight, undoCommand.height);
  };

  function abstractTestCanExecute (width, height, expectedErrors) {
    var screen = { width: 100, height: 100 };
    
    var command = new ResizeScreenCommand(screen, width, height);

    var canExecute = command.canExecute();

    if (expectedErrors.length) {
      assertFalse("Expected not executable:", canExecute.isExecutable);
      assertFalse("Expected not undoable:", canExecute.isUndoable);
      assertEquals("Expected error messages:", expectedErrors, canExecute.errorMessages);

      var caughtException = false;
      try {
        command.execute();
      } catch (e) {
        caughtException = true;
      }
      assertTrue("Expected execution to fail; no exception was caught:", caughtException);
    } else {
      assertTrue("Expected executable:", canExecute.isExecutable);
      assertTrue("Expected undoable:", canExecute.isUndoable);
      assertEquals("Expected no error messages:", [], canExecute.errorMessages);
      try {
        command.execute();
      } catch (e) {
        fail("Expected successful execution; caught: " + e);
      }
    }
  }

  ResizeScreenCommandClassTest.prototype.testCanExecuteValid = abstractTestCanExecute.bind(null, 1, 1, []);
  ResizeScreenCommandClassTest.prototype.testCanExecuteWidthLow = abstractTestCanExecute.bind(null, 0, 9999999, ["Width is 0; it must be > 0."]);
  ResizeScreenCommandClassTest.prototype.testCanExecuteHeightLow = abstractTestCanExecute.bind(null, 9999999, 0, ["Height is 0; it must be > 0."]);
  ResizeScreenCommandClassTest.prototype.testCanExecuteMultipleErrors = abstractTestCanExecute.bind(null, -128, -10, ["Width is -128; it must be > 0.", "Height is -10; it must be > 0."]);
}());