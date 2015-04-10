(function(){
  'use strict';
  
  var PolygonClassTest = TestCase("PolygonClassTest");
  
  var Polygon = require("models/Polygon");
  var RenderMode = require("models/RenderMode");
  
  PolygonClassTest.prototype.testIsClass = function () {
    assertTypeOf("function", Polygon);
  };
  PolygonClassTest.prototype.testConstructor = function () {
    var name = "foo";
    var renderMode = RenderMode.ADD;
    var points = [1,2,3];
    
    var toTest = new Polygon(name, renderMode, points.slice());

    assertTrue(toTest instanceof Polygon);
    assertEquals(name, toTest.name);
    assertEquals(renderMode, toTest.renderMode);
    assertEquals(points, toTest.points);
  };
  PolygonClassTest.prototype.testConstructorWithDefaultPoints = function () {
    var name = "foo";
    var renderMode = RenderMode.ADD;
    
    var toTest = new Polygon(name, renderMode);

    assertTrue(toTest instanceof Polygon);
    assertEquals(name, toTest.name);
    assertEquals(renderMode, toTest.renderMode);
    assertEquals([], toTest.points);
  };
  PolygonClassTest.prototype.testSetName = function () {
    var toTest = new Polygon("foo",RenderMode.SUBTRACT,[]);

    toTest.name = "bar";
    assertEquals("bar", toTest.name);
  };
  PolygonClassTest.prototype.testSetRenderMode = function () {
    var toTest = new Polygon("foo",RenderMode.SUBTRACT,[]);

    toTest.renderMode = RenderMode.ADD;
    assertEquals(RenderMode.ADD, toTest.renderMode);
  };
  PolygonClassTest.prototype.testSetpoints = function () {
    var toTest = new Polygon("foo",RenderMode.SUBTRACT,[]);

    toTest.points = [123456];
    assertEquals([123456], toTest.points);
  };

}());