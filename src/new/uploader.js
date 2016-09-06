var Uploader = function(callback) {
  var options = {
    Concurrency: 5,
    MaxFileSize: 25 * 1024 * 1024,
    ChunkSize: 1 * 1024 * 1024
  };

  var handlers = [];

  var add = function(file) {
    var h = Upload(file, callback);
    file.handler = h;
    handlers.push(h);
    h.add();
  };

  var start = function() {
    for(var i = 0; i < handlers.length; i++) {
      var h = handlers[i];
      h.start();
    }
  };

  var remove = function(file) {
    alert('why are you calling me?');
    file.handler.remove();
  };

  return {
    start: start,
    remove: remove,
    add: add
  };
};
