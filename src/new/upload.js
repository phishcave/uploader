var uploadWorker = null
var uploadWorkerLoaded = false;
var uploadWorkerCallbacks = {};

var Upload = function(obj, callback) {
  if (obj === undefined) {
    console.log("Can not upload nothing!");
    return;
  }

  if (!uploadWorkerLoaded) {
    uploadWorker = new UploadWorker(function(e) {
      var callbackFunc = uploadWorkerCallbacks[e.id];

      if (callbackFunc === undefined) {
        console.log("Failed to find callback func for " + e.data.id);
        console.dir(e);
        return;
      }

      var id = e.id;
      var type = e.type;
      var payload = e.payload;
      var callback = uploadWorkerCallbacks[id];

      callback(type, payload);
    });
  }

  var x = new UploadHandler(obj, callback);
  return x;
};

var UploadHandler = function(file, callback) {
  var id = Math.random();
  file.id = id;

  var handleCallback = function(type, payload) {
    switch(type) {
      case 'file:hashed':
        file.hash = payload;
        break;
      default:
        console.log("unsupported msg", type);
        break;
    }
  };

  uploadWorkerCallbacks[id] = function(type, payload) {
    // handle the message here, but also pass it on.
    handleCallback(type, payload);
    callback(file.id, type, payload);
  };

  var emit = function(type, payload) {
    uploadWorker.send({id: id, type: type, payload: payload});
  };

  return {
    add: function() {
      emit('add', file);
    },
    start: function() {
      emit('start', file);
    }
  };
};
