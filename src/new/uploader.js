var File = function(blob) {
  if (blob === undefined) {
    console.log("Must specify file data");
    return;
  }

  this.Data = function() {
    return blob;
  };

  this.Attributes = {
  };
};


// var Uploader = function() {
//   var options = {
//     Concurrency: 5,
//     MaxFileSize: 25 * 1024 * 1024,
//     ChunkSize: 1 * 1024 * 1024
//   };

//   var files = []; // internal list of files.

//   this.AddFile = function(file) {
//     SHA1(file, function(hash) {
//       file.Attributes.Hash = hash;
//       files.push(file);
//     });
//   };

//   var fileExistsOnServer = function(file) {

//   };
// };


var Uploader = function(callback) {
  var handlers = [];

  var add = function(file) {
    var h = Upload(file, callback);
    handlers.push(h);
    h.add()
  };

  var start = function() {
    for(var i = 0; i < handlers.length; i++) {
      var h = handlers[i];
      h.start();
    }
  };

  return {
    start: start,
    add: add
  };
};


