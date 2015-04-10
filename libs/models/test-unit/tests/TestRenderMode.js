(function(){
  'use strict';
  
  var RenderModeEnumTest = TestCase("RenderModeEnumTest");
  
  var RenderMode = require("models/RenderMode");
  
  var expectedModes = ["ADD", "SUBTRACT"];
  RenderModeEnumTest.prototype.testIsInstance = function () {
    assertTypeOf("object", RenderMode);
  };
  RenderModeEnumTest.prototype.testGetValues = function () {
    assertEquals(expectedModes, RenderMode.getValues())
  };
  RenderModeEnumTest.prototype.testValues = function () {
    for (var i in expectedModes) {
      var expectedMode = expectedModes[i];

      assertEquals(expectedMode, RenderMode[expectedMode]);
    }
  };
  RenderModeEnumTest.prototype.testGetValueOf = function () {
    for (var i in expectedModes) {
      var expectedMode = expectedModes[i];

      var actualIndex = RenderMode.getValueOf(expectedMode);
      assertTypeOf("number", actualIndex);

      assertEquals(expectedMode, RenderMode[actualIndex]);
    }
  };
}());