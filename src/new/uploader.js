var Uploader = function(callback) {
  var settings = new UploaderSettings();
  var handlers = {};
  var options = {
    concurrency: 5,
    max_file_size: 25 * 1024 * 1024,
    chunk_size: 1 * 1024 * 1024
  };

  var onmessage = function(evt) {
    var id = evt.id;
    var type = evt.type;
    var payload = evt.payload;
    handlers[id].onmessage(type, payload);
    callback(id, type, payload);
  };

  var uploadWorker = new UploadWorker(onmessage);

  var buildUploadHandler = function(file) {
    var h = new UploadHandler(file, uploadWorker);
    return h;
  };

  var calcNumChunks = function(file) {
    var blobSize = file.blob.size;
    var chunkSize = options.chunk_size;
    return Math.ceil(blobSize/chunkSize);
  };

  return {
    start: function() {
      for(var i = 0; i < handlers.length; i++) {
        var h = handlers[i];
        h.start();
      }
    },
    remove: function(file) {
      alert('why are you calling me?');
      file.handler.remove();
    },
    add: function(file) {
      // var h = Upload(file, callback);
      var h = buildUploadHandler(file);
      handlers[file.id] = h;
      file.handler = h;
      file.state = 'new'; // default state.
      file.chunk_size = options.chunk_size;
      file.num_chunks = calcNumChunks(file);
      file.instant = settings.instant();
      h.add();
    },
    options: options,
    settings: settings
  };
};
