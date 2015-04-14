(function(){
  "use strict";
  
  var RemovePointCommandClassTest = TestCase("RemovePointCommandClassTest");
  
  var RemovePointCommand = require("commands/RemovePointCommand");

  var Point = require("models/Point");
  var Polygon = require("models/Polygon");
  var InsertPointCommand = require("commands/InsertPointCommand");
  
  RemovePointCommandClassTest.prototype.testIsClass = function () {
    assertTypeOf("function", RemovePointCommand);
  };
  RemovePointCommandClassTest.prototype.testConstructor = function () {
    var screen = { screen: true };
    var polygon = new Polygon("foo", "foo");
    var point = new Point(1, 2);
    
    var toTest = new RemovePointCommand(screen, polygon, point);

    assertTrue(toTest instanceof RemovePointCommand);
    assertEquals(screen, toTest.screen);
    assertEquals(polygon, toTest.polygon);
    assertEquals(point, toTest.point);
  };
  RemovePointCommandClassTest.prototype.testGetDescription = function () {
    var toTest = new RemovePointCommand(null, new Polygon("foo", "foo"), new Point(3,4));

    assertEquals("Remove Point(3, 4) from Polygon(foo)", toTest.getDescription());
  };

  RemovePointCommandClassTest.prototype.testExecute = function () {
    var screen = { width: 100, height: 100 };
    var polygon = new Polygon("foo", "foo", [new Point(1, 2), new Point(50, 53), new Point(3,4)]);

    var expectedPosition = 1;
    var point = polygon.points[expectedPosition];
    var expectedPoints = polygon.points.slice();
    expectedPoints.splice(expectedPosition, 1);

    var toTest = new RemovePointCommand(screen, polygon, point);

    assertEquals(point, toTest.point);

    var undoCommand = toTest.execute();

    assertEquals("Expected polygon to have points:", expectedPoints, polygon.points);
    
    assertTrue("Expected a InsertPointCommand to be provided to undo execution:", undoCommand instanceof InsertPointCommand);
    assertEquals("Expected correct screen in undo command:", screen, undoCommand.screen);
    assertEquals("Expected correct polygon in undo command:", polygon, undoCommand.polygon);
    assertEquals("Expected correct point in undo command:", point, undoCommand.point);
    assertEquals("Expected correct position in undo command:", expectedPosition, undoCommand.position);
  };

  function abstractTestCanExecute (x, y, expectedErrors) {
    var screen = { width: 100, height: 100 };

    var polygon = new Polygon("foo", "foo", [new Point(12, 34)]);
    
    var command = new RemovePointCommand(screen, polygon, new Point(x, y));

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
  RemovePointCommandClassTest.prototype.testCanExecuteValid = abstractTestCanExecute.bind(null, 12, 34, []);
  RemovePointCommandClassTest.prototype.testCanExecuteNotExist = abstractTestCanExecute.bind(null, 0, 0, ["Can't find Point(0, 0) in Polygon(foo); polygon must contain point to remove."]);

}());