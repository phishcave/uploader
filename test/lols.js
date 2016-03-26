before(function () {
  this.jsdom = require('jsdom-global')()
  var jsdom = require('jsdom')
  var glob = require('glob');

  var scripts = glob.sync('*.js');
  var libs = glob.sync('lib/*.js');

  jsdom.env("", {
    scripts: scripts.concat(libs),
    done: function(err, w) {
      window = w
    }
  })
})

after(function () {
  this.jsdom()
})

var assert = require('assert');

describe('Menu', function() {
  var m;
  beforeEach(function() {
    m = new window.Menu();
  });

  describe('.addEntry()', function () {
    it('should return -1 when the value is not present', function () {
      var dom = m.render();
      console.log("wee" + dom);
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});


// describe("menu has entries", function() {
//   var menu = Menu();
//   console.log(menu.dom);
// });


// console.log('yolo');
