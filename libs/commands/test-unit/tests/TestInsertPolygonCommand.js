(function(){
  "use strict";
  
  var InsertPolygonCommandClassTest = TestCase("InsertPolygonCommandClassTest");
  
  var InsertPolygonCommand = require("commands/InsertPolygonCommand");

  var Screen = require("models/Screen");
  var Polygon = require("models/Polygon");
  var RenderMode = require("models/RenderMode");
  var RemovePolygonCommand = require("commands/RemovePolygonCommand");
  
  InsertPolygonCommandClassTest.prototype.testIsClass = function () {
    assertTypeOf("function", InsertPolygonCommand);
  };
  InsertPolygonCommandClassTest.prototype.testConstructor = function () {
    var screen = new Screen(100, 100);
    var name = "foo";
    var renderMode = RenderMode.SUBTRACT;
    var position = 2;
    
    var toTest = new InsertPolygonCommand(screen, name, renderMode, position);

    assertTrue(toTest instanceof InsertPolygonCommand);
    assertEquals(screen, toTest.screen);
    assertEquals(new Polygon(name, renderMode), toTest.polygon);
    assertEquals(position, toTest.position);
  };
  InsertPolygonCommandClassTest.prototype.testGetDescription = function () {
    var toTest = new InsertPolygonCommand(new Screen(123, 456), "foo", 17);

    assertEquals("Add Polygon(foo) to Screen(123x456).", toTest.getDescription());
  };

  function abstractTestExecution(position) {
    var screen = new Screen(100, 200, [0, 1]);
    var name = "foo";
    var renderMode = RenderMode.ADD;

    var expectedPolygon = new Polygon(name, renderMode);
    var expectedPolygons = screen.polygons.slice();
    expectedPolygons.splice(position, 0, expectedPolygon);

    var toTest = new InsertPolygonCommand(screen, name, renderMode, position);

    assertEquals(expectedPolygon, toTest.polygon);

    var undoCommand = toTest.execute();

    assertEquals("Expected screen to have polygons:", expectedPolygons, screen.polygons);
    
    assertTrue("Expected a RemovePolygonCommand to be provided to undo execution:", undoCommand instanceof RemovePolygonCommand);
    assertEquals("Expected correct screen in undo command:", screen, undoCommand.screen);
    assertEquals("Expected correct polygon in undo command:", expectedPolygon, undoCommand.polygon);
  };
  InsertPolygonCommandClassTest.prototype.testExecutePosition0 = abstractTestExecution.bind(null, 0);
  InsertPolygonCommandClassTest.prototype.testExecutePosition1 = abstractTestExecution.bind(null, 1);
  InsertPolygonCommandClassTest.prototype.testExecutePosition2 = abstractTestExecution.bind(null, 2);

  function abstractTestCanExecute (name, renderMode, position, expectedErrors) {
    var screen = new Screen(100, 200, [new Polygon("bar")]);
    
    var command = new InsertPolygonCommand(screen, name, renderMode, position);

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
  InsertPolygonCommandClassTest.prototype.testCanExecuteValid = abstractTestCanExecute.bind(null, "foo", RenderMode.ADD, 0, []);
  InsertPolygonCommandClassTest.prototype.testCanExecuteEmptyName = abstractTestCanExecute.bind(null, "", RenderMode.ADD, 0, ["Name is blank; a polygon must have a name."]);
  InsertPolygonCommandClassTest.prototype.testCanExecuteLongName = abstractTestCanExecute.bind(null, "123456789012345678901", RenderMode.ADD, 0, ["Name is 21 characters long; it must be <= 20 characters."]);
  InsertPolygonCommandClassTest.prototype.testCanExecuteInvalidRenderMode = abstractTestCanExecute.bind(null, "12345678901234567890", "foo", 0, ["Render mode (foo) is unknown; it must be a valid mode."]);
  InsertPolygonCommandClassTest.prototype.testCanExecuteLowPosition = abstractTestCanExecute.bind(null, "12345678901234567890", RenderMode.ADD, -1, ["Insertion position is -1; it must be between 0 and the number of polygons in the screen."]);
  InsertPolygonCommandClassTest.prototype.testCanExecuteHighPosition = abstractTestCanExecute.bind(null, "foo", RenderMode.ADD, 2, ["Insertion position is 2; it must be between 0 and the number of polygons in the screen."]);
  InsertPolygonCommandClassTest.prototype.testCanExecuteDuplicate = abstractTestCanExecute.bind(null, "bar", RenderMode.ADD, 0, ["Polygon(bar) is already in Screen(100x200); duplicate polygons are not allowed."]);
  InsertPolygonCommandClassTest.prototype.testCanExecuteMultipleErrors = abstractTestCanExecute.bind(null, "", "invalid", -2, ["Name is blank; a polygon must have a name.", "Render mode (invalid) is unknown; it must be a valid mode.", "Insertion position is -2; it must be between 0 and the number of polygons in the screen."]);

}());