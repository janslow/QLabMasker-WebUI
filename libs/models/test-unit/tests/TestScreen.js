(function(){
  'use strict';
  
  var ScreenClassTest = TestCase("ScreenClassTest");
  
  var Screen = require("models/Screen");
  
  ScreenClassTest.prototype.testIsClass = function () {
    assertTypeOf("function", Screen);
  };
  ScreenClassTest.prototype.testConstructor = function () {
    var width = 100;
    var height = 111;
    var polygons = [1,2,3];
    
    var toTest = new Screen(width, height, polygons.slice());

    assertTrue(toTest instanceof Screen);
    assertEquals(width, toTest.width);
    assertEquals(height, toTest.height);
    assertEquals(polygons, toTest.polygons);
  };
  ScreenClassTest.prototype.testConstructorWithDefaultPolygons = function () {
    var width = 100;
    var height = 111;
    
    var toTest = new Screen(width, height);

    assertTrue(toTest instanceof Screen);
    assertEquals(width, toTest.width);
    assertEquals(height, toTest.height);
    assertEquals([], toTest.polygons);
  };
  ScreenClassTest.prototype.testSetWidth = function () {
    var toTest = new Screen(1,2,[]);

    toTest.width = 10;
    assertEquals(10, toTest.width);
  };
  ScreenClassTest.prototype.testSetHeight = function () {
    var toTest = new Screen(1,2,[]);

    toTest.height = 10;
    assertEquals(10, toTest.height);
  };
  ScreenClassTest.prototype.testSetPolygons = function () {
    var toTest = new Screen(1,2,[]);

    toTest.polygons = [123456];
    assertEquals([123456], toTest.polygons);
  };

}());