(function(){
  'use strict';
  
  var InsertPointCommandClassTest = TestCase("InsertPointCommandClassTest");
  
  var InsertPointCommand = require("commands/InsertPointCommand");

  var Point = require("models/Point");
  var Polygon = require("models/Polygon");
  var RemovePointCommand = require("commands/RemovePointCommand");
  
  InsertPointCommandClassTest.prototype.testIsClass = function () {
    assertTypeOf("function", InsertPointCommand);
  };
  InsertPointCommandClassTest.prototype.testConstructor = function () {
    var screen = { screen: true };
    var polygon = new Polygon("foo", "foo");
    var x = 10;
    var y = 20;
    var position = 2;
    
    var toTest = new InsertPointCommand(screen, polygon, x, y, position);

    assertTrue(toTest instanceof InsertPointCommand);
    assertEquals(screen, toTest.screen);
    assertEquals(polygon, toTest.polygon);
    assertEquals(new Point(x, y), toTest.point);
    assertEquals(position, toTest.position);
  };
  InsertPointCommandClassTest.prototype.testGetDescription = function () {
    var toTest = new InsertPointCommand(null, new Polygon("foo", "foo"), 11, 13, 17);

    assertEquals("Add Point(11, 13) to Polygon(foo)", toTest.getDescription());
  };

  function abstractTestExecution(position) {
    var screen = { width: 100, height: 100 };
    var polygon = new Polygon("foo", "foo", [0, 1]);
    var x = 51
    var y = 53;

    var expectedPoint = new Point(x, y);
    var expectedPoints = polygon.points.slice();
    expectedPoints.splice(position, 0, expectedPoint);

    var toTest = new InsertPointCommand(screen, polygon, x, y, position);

    assertEquals(expectedPoint, toTest.point);

    var undoCommand = toTest.execute();

    assertEquals("Expected polygon to have points:", expectedPoints, polygon.points);
    
    assertTrue("Expected a RemovePointCommand to be provided to undo execution:", undoCommand instanceof RemovePointCommand);
    assertEquals("Expected correct screen in undo command:", screen, undoCommand.screen);
    assertEquals("Expected correct polygon in undo command:", polygon, undoCommand.polygon);
    assertEquals("Expected correct point in undo command:", expectedPoint, undoCommand.point);
  };
  InsertPointCommandClassTest.prototype.testExecutePosition0 = abstractTestExecution.bind(null, 0);
  InsertPointCommandClassTest.prototype.testExecutePosition1 = abstractTestExecution.bind(null, 1);
  InsertPointCommandClassTest.prototype.testExecutePosition2 = abstractTestExecution.bind(null, 2);

  function abstractTestCanExecute (x, y, position, expectedErrors) {
    var screen = { width: 100, height: 100 };

    var polygon = new Polygon("foo", "foo", [new Point(12, 34)]);
    
    var command = new InsertPointCommand(screen, polygon, x, y, position);

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
  InsertPointCommandClassTest.prototype.testCanExecuteValid = abstractTestCanExecute.bind(null, 99, 99, 0, []);
  InsertPointCommandClassTest.prototype.testCanExecuteLowX = abstractTestCanExecute.bind(null, -1, 0, 0, ["x position is -1; it must be >= 0 and < screen width."]);
  InsertPointCommandClassTest.prototype.testCanExecuteHighX = abstractTestCanExecute.bind(null, 100, 0, 0, ["x position is 100; it must be >= 0 and < screen width."]);
  InsertPointCommandClassTest.prototype.testCanExecuteLowY = abstractTestCanExecute.bind(null, 0, -1, 0, ["y position is -1; it must be >= 0 and < screen height."]);
  InsertPointCommandClassTest.prototype.testCanExecuteHighY = abstractTestCanExecute.bind(null, 0, 100, 0, ["y position is 100; it must be >= 0 and < screen height."]);
  InsertPointCommandClassTest.prototype.testCanExecuteLowPosition = abstractTestCanExecute.bind(null, 99, 99, -1, ["Insertion position is -1; it must be between 0 and the number of points in the polygon."]);
  InsertPointCommandClassTest.prototype.testCanExecuteHighPosition = abstractTestCanExecute.bind(null, 99, 99, 2, ["Insertion position is 2; it must be between 0 and the number of points in the polygon."]);
  InsertPointCommandClassTest.prototype.testCanExecuteDuplicate = abstractTestCanExecute.bind(null, 12, 34, 0, ["Point(12, 34) is already in Polygon(foo); duplicate points are not allowed."]);
  InsertPointCommandClassTest.prototype.testCanExecuteMultipleErrors = abstractTestCanExecute.bind(null, -1, 100, -2, ["x position is -1; it must be >= 0 and < screen width.", "y position is 100; it must be >= 0 and < screen height.", "Insertion position is -2; it must be between 0 and the number of points in the polygon."]);

}());