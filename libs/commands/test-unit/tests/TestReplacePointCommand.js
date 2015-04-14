(function(){
  "use strict";
  
  var ReplacePointCommandClassTest = TestCase("ReplacePointCommandClassTest");
  
  var ReplacePointCommand = require("commands/ReplacePointCommand");

  var Point = require("models/Point");
  var Polygon = require("models/Polygon");
  ReplacePointCommandClassTest.prototype.testIsClass = function () {
    assertTypeOf("function", ReplacePointCommand);
  };
  ReplacePointCommandClassTest.prototype.testConstructor = function () {
    var screen = { screen: true };
    var polygon = new Polygon("foo", "foo");
    var oldPoint = new Point(1, 2);
    var x = 3;
    var y = 4;
    
    var toTest = new ReplacePointCommand(screen, polygon, oldPoint, x, y);

    assertTrue(toTest instanceof ReplacePointCommand);
    assertEquals(screen, toTest.screen);
    assertEquals(polygon, toTest.polygon);
    assertEquals(oldPoint, toTest.oldPoint);
    assertEquals(new Point(3, 4), toTest.newPoint);
  };
  ReplacePointCommandClassTest.prototype.testGetDescription = function () {
    var toTest = new ReplacePointCommand(null, new Polygon("foo", "foo"), new Point(1, 2), 3, 4);

    assertEquals("Replace Point(1, 2) in Polygon(foo) with Point(3, 4).", toTest.getDescription());
  };

  ReplacePointCommandClassTest.prototype.testExecute = function () {
    var screen = { width: 100, height: 100 };
    var polygon = new Polygon("foo", "foo", [new Point(1, 2), new Point(1, 4), new Point(3,4)]);

    var newPoint = new Point(3,1);

    var expectedPosition = 1;
    var oldPoint = polygon.points[expectedPosition];
    var expectedPoints = polygon.points.slice();
    expectedPoints.splice(expectedPosition, 1, newPoint);


    var toTest = new ReplacePointCommand(screen, polygon, oldPoint, newPoint.x, newPoint.y);

    var undoCommand = toTest.execute();

    assertEquals("Expected polygon to have points:", expectedPoints, polygon.points);
    
    assertTrue("Expected a ReplacePointCommand to be provided to undo execution:", undoCommand instanceof ReplacePointCommand);
    assertEquals("Expected correct screen in undo command:", screen, undoCommand.screen);
    assertEquals("Expected correct polygon in undo command:", polygon, undoCommand.polygon);
    assertEquals("Expected correct old point in undo command:", newPoint, undoCommand.oldPoint);
    assertEquals("Expected correct new point in undo command:", oldPoint, undoCommand.newPoint);
  };

  function abstractTestCanExecute (oldX, oldY, newX, newY, expectedErrors) {
    var screen = { width: 100, height: 100 };

    var polygon = new Polygon("foo", "foo", [new Point(12, 34), new Point(56, 78)]);
    
    var command = new ReplacePointCommand(screen, polygon, new Point(oldX, oldY), newX, newY);

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
  ReplacePointCommandClassTest.prototype.testCanExecuteValid = abstractTestCanExecute.bind(null, 12, 34, 99, 99, []);
  ReplacePointCommandClassTest.prototype.testCanExecuteLowX = abstractTestCanExecute.bind(null, 12, 34, -1, 0, ["New x position is -1; it must be >= 0 and < screen width."]);
  ReplacePointCommandClassTest.prototype.testCanExecuteHighX = abstractTestCanExecute.bind(null, 12, 34, 100, 0, ["New x position is 100; it must be >= 0 and < screen width."]);
  ReplacePointCommandClassTest.prototype.testCanExecuteLowY = abstractTestCanExecute.bind(null, 12, 34, 0, -1, ["New y position is -1; it must be >= 0 and < screen height."]);
  ReplacePointCommandClassTest.prototype.testCanExecuteHighY = abstractTestCanExecute.bind(null, 12, 34, 0, 100, ["New y position is 100; it must be >= 0 and < screen height."]);
  ReplacePointCommandClassTest.prototype.testCanExecuteNotExist = abstractTestCanExecute.bind(null, 13, 34, 99, 99, ["Can't find Point(13, 34) in Polygon(foo); polygon must contain old point."]);
  ReplacePointCommandClassTest.prototype.testCanExecuteDuplicate = abstractTestCanExecute.bind(null, 12, 34, 56, 78, ["Point(56, 78) is already in Polygon(foo); duplicate points are not allowed."]);
  ReplacePointCommandClassTest.prototype.testCanExecuteDuplicateSelf = abstractTestCanExecute.bind(null, 12, 34, 12, 34, ["Point(12, 34) is already in Polygon(foo); duplicate points are not allowed."]);
  ReplacePointCommandClassTest.prototype.testCanExecuteMultipleErrors = abstractTestCanExecute.bind(null, 12, 35, -1, 100, ["New x position is -1; it must be >= 0 and < screen width.", "New y position is 100; it must be >= 0 and < screen height.", "Can't find Point(12, 35) in Polygon(foo); polygon must contain old point."]);

}());