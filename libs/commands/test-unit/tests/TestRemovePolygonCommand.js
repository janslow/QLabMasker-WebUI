(function(){
  "use strict";
  
  var RemovePolygonCommandClassTest = TestCase("RemovePolygonCommandClassTest");
  
  var RemovePolygonCommand = require("commands/RemovePolygonCommand");

  var Polygon = require("models/Polygon");
  var Screen = require("models/Screen");
  var RenderMode = require("models/RenderMode");
  
  RemovePolygonCommandClassTest.prototype.testIsClass = function () {
    assertTypeOf("function", RemovePolygonCommand);
  };
  RemovePolygonCommandClassTest.prototype.testConstructor = function () {
    var screen = new Screen(100, 200);
    var polygon = new Polygon("foo", RenderMode.ADD);
    
    var toTest = new RemovePolygonCommand(screen, polygon);

    assertTrue(toTest instanceof RemovePolygonCommand);
    assertEquals(screen, toTest.screen);
    assertEquals(polygon, toTest.polygon);
  };
  RemovePolygonCommandClassTest.prototype.testGetDescription = function () {
    var toTest = new RemovePolygonCommand(new Screen(123, 456), new Polygon("foo", RenderMode.ADD));

    assertEquals("Remove Polygon(foo) from Screen(123x456).", toTest.getDescription());
  };

  RemovePolygonCommandClassTest.prototype.testExecute = function () {
    var screen = new Screen(123, 456, [new Polygon("foo", RenderMode.ADD), new Polygon("bar", RenderMode.ADD), new Polygon("other", RenderMode.SUBTRACT)]);

    var expectedPosition = 1;
    var polygon = screen.polygons[expectedPosition];
    var expectedPolygons = screen.polygons.slice();
    expectedPolygons.splice(expectedPosition, 1);

    var toTest = new RemovePolygonCommand(screen, polygon);

    assertEquals(polygon, toTest.polygon);

    var undoCommand = toTest.execute();

    assertEquals("Expected screen to have polygons:", expectedPolygons, screen.polygons);
    
    assertNull("Expected no undo command to be provided:", undoCommand);
  };

  function abstractTestCanExecute (name, expectedErrors) {
    var screen = new Screen(100, 200, [new Polygon("bar", RenderMode.SUBTRACT)]);
    
    var command = new RemovePolygonCommand(screen, new Polygon(name, RenderMode.ADD));

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
      assertFalse("Expected undoable:", canExecute.isUndoable);
      assertEquals("Expected no error messages:", [], canExecute.errorMessages);
      try {
        command.execute();
      } catch (e) {
        fail("Expected successful execution; caught: " + e);
      }
    }
  }
  RemovePolygonCommandClassTest.prototype.testCanExecuteValid = abstractTestCanExecute.bind(null, "bar", []);
  RemovePolygonCommandClassTest.prototype.testCanExecuteNotExist = abstractTestCanExecute.bind(null, "foo", ["Can't find Polygon(foo) in Screen(100x200); screen must contain polygon to remove."]);

}());