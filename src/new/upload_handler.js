var UploadHandler = function(file, callback) {
  var id = Math.random();
  file.id = id;

  var handleCallback = function(type, payload) {
    switch(type) {
      case 'file:hashed':
        file.hash = payload;
        break;
      default:
        console.log("Ignoring", type);
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
    },
    remove: function() {
      emit('remove', file);
    }
  };
};
