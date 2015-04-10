(function(){
  'use strict';
  
  var PointClassTest = TestCase("PointClassTest");
  
  var Point = require("models/Point");
  
  PointClassTest.prototype.testIsClass = function () {
    assertTypeOf("function", Point);
  };
  PointClassTest.prototype.testConstructor = function () {
    var x = 100;
    var y = 111;
    
    var toTest = new Point(x, y);

    assertTrue(toTest instanceof Point);
    assertEquals(x, toTest.x);
    assertEquals(y, toTest.y);
  };
  PointClassTest.prototype.testSetX = function () {
    var toTest = new Point(1,2,[]);

    toTest.x = 10;
    assertEquals(10, toTest.x);
  };
  PointClassTest.prototype.testSetY = function () {
    var toTest = new Point(1,2,[]);

    toTest.y = 10;
    assertEquals(10, toTest.y);
  };

}());