(function(){
  "use strict";
  
  var ChangeRenderModeCommandClassTest = TestCase("ChangeRenderModeCommandClassTest");
  
  var ChangeRenderModeCommand = require("commands/ChangeRenderModeCommand");

  var Polygon = require("models/Polygon");
  var RenderMode = require("models/RenderMode");
  
  ChangeRenderModeCommandClassTest.prototype.testIsClass = function () {
    assertTypeOf("function", ChangeRenderModeCommand);
  };
  ChangeRenderModeCommandClassTest.prototype.testConstructor = function () {
    var screen = { screen: true };
    var renderMode = RenderMode.ADD;
    var polygon = new Polygon("foo", renderMode);
    
    var toTest = new ChangeRenderModeCommand(screen, polygon, renderMode);

    assertTrue(toTest instanceof ChangeRenderModeCommand);
    assertEquals(screen, toTest.screen);
    assertEquals(polygon, toTest.polygon);
    assertEquals(renderMode, toTest.renderMode);
  };
  ChangeRenderModeCommandClassTest.prototype.testGetDescription = function () {
    var toTest = new ChangeRenderModeCommand(null, new Polygon("foo", RenderMode.SUBTRACT), RenderMode.ADD);

    assertEquals("Change Polygon(foo) to ADD mode.", toTest.getDescription());
  };

  ChangeRenderModeCommandClassTest.prototype.testExecute = function () {
    var screen = { width: 100, height: 100 };
    var originalRenderMode = RenderMode.ADD;
    var polygon = new Polygon("foo", originalRenderMode);
    var renderMode = RenderMode.SUBTRACT;

    var toTest = new ChangeRenderModeCommand(screen, polygon, renderMode);

    assertEquals(renderMode, toTest.renderMode);

    var undoCommand = toTest.execute();

    assertEquals("Expected polygon to change render mode:", renderMode, polygon.renderMode);
    
    assertTrue("Expected a ChangeRenderModeCommand to be provided to undo execution:", undoCommand instanceof ChangeRenderModeCommand);
    assertEquals("Expected correct screen in undo command:", screen, undoCommand.screen);
    assertEquals("Expected correct polygon in undo command:", polygon, undoCommand.polygon);
    assertEquals("Expected correct renderMode in undo command:", originalRenderMode, undoCommand.renderMode);
  };

  function abstractTestCanExecute (renderMode, expectedErrors) {
    var screen = { width: 100, height: 100 };
    var polygon = new Polygon("foo", RenderMode.ADD);
    
    var command = new ChangeRenderModeCommand(screen, polygon, renderMode);

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

  ChangeRenderModeCommandClassTest.prototype.testCanExecuteValid = abstractTestCanExecute.bind(null, RenderMode.SUBTRACT, []);
  ChangeRenderModeCommandClassTest.prototype.testCanExecuteInvalid = abstractTestCanExecute.bind(null, "foo", ["\"foo\" is not a valid render mode; it must be one of the defined modes."]);
}());