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

}());