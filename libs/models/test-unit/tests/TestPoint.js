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

    try {
      toTest.x = 10;
      fail("x should not be writable.");
    } catch (e) {
    }

    assertEquals(1, toTest.x);
  };
  PointClassTest.prototype.testSetY = function () {
    var toTest = new Point(1,2,[]);

    try {
      toTest.y = 10;
      fail("y should not be writable.");
    } catch (e) {
    }

    assertEquals(2, toTest.y);
  };

}());