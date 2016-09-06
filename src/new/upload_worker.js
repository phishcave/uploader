// Events Emitted by this Worker:
// file:started
// file:chunked
// file:hashed
// file:paused
// file:progress
// file:resumed
// file:finished
// chunk:created
// chunk:state
// chunk:hashed
// chunk:progress
// chunk:started
// chunk:cancelled
// chunk:errored
// chunk:finished
//

var get = function(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) {
      // not the complete state
      return;
    }

    var response = {};
    if (xhr.response !== "") {
      response = JSON.parse(xhr.response);
    }
    callback(xhr.status, response);
  };
  xhr.send();
};

var UploadCommands = function(file, emit) {
  var checkIfFileExists = function(hash) {
    var url = '/api/v1/check/' + hash;

    var existsCallback = function(status, response) {
      if (status === 404) {
        console.log("file does not exist");
      } else if ( status ===  200 ) {
        console.dir(response);
        emit('file:state', response.state);
        console.log("file exists");
      }
    };

    get(url, existsCallback);
  };


  // This chunks the file and after all the chunks have been hashed, starts the
  // upload process.
  var startUpload = function() {
    var chunkSize = 1000; // kb
    var numChunks = file.blob.size / chunkSize;
    var chunkPromises = [];

    if (file.chunks !== undefined && file.chunks.length > 0) {
      console.log("File Already Chunked!");
      return;
    }

    file.chunks = [];
    for(var i = 0; i < numChunks; i++) {
      var dataStart = i * chunkSize;
      var dataEnd = (i + 1) * chunkSize;

      var blob = file.blob.slice(dataStart, dataEnd);
      var chunk = {
        id: Math.random(),
        position: i,
        blob: blob
      };

      file.chunks.push(chunk);

      // We need to track when we've added all chunks.
      var chunkPromise = addChunk(chunk);
      chunkPromises.push(chunkPromise);
    };

    Promise.all(chunkPromises).then(function() {
      startUpload();
      emit('file:chunked');
    });
  };

  var addChunk = function(chunk) {
    return new Promise(function(resolve) {
      SHA1(chunk.blob, function(hash) {
        chunk.hash = hash;
        emit('chunk:created', chunk);
        return resolve();
      });
    });
  };

  // When a file is added we must hash it so that we can check
  // if it has been uploaded before.
  var addFile = function() {
    emit('file:added', file);

    SHA1(file.blob, function(hash) {
      emit('file:hashed', hash);

      checkIfFileExists(hash);
    });
  };

  var removeFile = function() {
    emit('file:removed', file);
  };

  return {
    addFile: addFile,
    removeFile: removeFile,
    startFile: startFile
  };
};

var UploadWorker = function(callback) {
  // Post a message back to the callback.
  var postMessage = function(payload) {
    callback(payload);
  };

  var onmessage = function(e) {
    var id = e.id;
    var type = e.type;
    var file = e.payload;

    // Not sure how much I like defining emit here.
    var emit = function(type, payload) {
      postMessage({id: id, type: type, payload: payload});
    };

    var commands = new UploadCommands(file, emit);

    switch(type) {
      case 'add':
        commands.addFile();
        break;
      case 'remove':
        commands.removeFile();
        break;
      case 'start':
        commands.startFile();
        break;
      default:
        console.log("Received unrecognized command: " + type);
        break;
    }
  };

  return {
    send: onmessage
  };
};

var FileChunker = function(file) {
  var chunkSize = 1;
  var blob = file.blob;

  var start = function() {

  };
};
