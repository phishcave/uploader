var __upload_id = 10000;

var UploadFile = function(file) {
  var chunkSize = 1024 * 1024;
  var chunkSize = 100;
  var startTime;
  var chunks = [];
  var state  = 'queued';
  var hash   = "";
  var id     = __upload_id += 1;

  this.fakeUpload= function() {
    state = 'uploading';
    var b = new Blob(["ddawd"], { type: 'text/plain' });
    chunks.push(new Chunk(1, b));
    chunks.push(new Chunk(2, b));
    chunks.push(new Chunk(3, b));
  }

  this.canStart = function() {
    // has been hashed
    return hash.length > 0;
  };

  this.start = function() {
    this.state = 'uploading';

  };

  this.resume = function() {
    this.state = 'uploading';
  };

  this.restart = function() {
    this.state = 'uploading';
  };

  this.pause = function() {
    this.state = 'paused';
  };

  this.cancel = function() {
    this.state = 'canceled';
  }

  this.isQueued = function() {
    return state == 'queued';
  };

  this.isUploading = function() {
    return state == 'uploading';
  };

  this.isFinished = function() {
    return state == 'finished';
  };

  this.isPaused = function() {
    return state == 'paused';
  };

  this.isCanceled = function() {
    return state == 'canceled';
  };

  this.state = function() {
    console.log("dont use file.state");
    return state;
  }

  this.id = function() {
    return id;
  };

  this.blob = function() {
    return file.slice();
  };

  this.onHashCalculated = function(sha) {
    hash  = sha;
    this.hashCalculatedCallback(hash);
  }.bind(this);

  // Progress in relation to all chunks.
  this.progressPercent = function() {
    var loaded = 0;

    for(var i = 0; i < chunks.length; i++) {
      loaded += chunks[i].loaded;
    }

    return loaded / file.size;
  };

  this.chunksFinished = function() {
    for ( var i = 0; i < chunks.length; i++ ) {
      if (!chunks[i].isFinished()) {
        return false;
      }
    }

    return true;
  }

  this.type = function() {
    return mime2name(file.type);
  };

  this.name = function() {
    return file.name;
  };

  this.numChunks = function() {
    return Math.ceil(file.size / chunkSize);
  };

  this.chunks = function() {
    return chunks;
  };

  this.size = function() {
    return filesize(file.size);
  };

  this.hash = function() {
    return hash;
  };

  this.onChunkStarted = function(chunk) {
    startTime = Date.now();
  };

  this.onChunkFinished = function(chunk) {
    console.log("chunk finished");
    if ( this.chunksFinished()) {
      this.onFinished();
    }
  };

  this.onFinished = function() {
    console.log("upload finished");
    state = 'finished';
    this.finishedCallback();

  };

  this.onChunkProgress = function(chunk, progress) {

  };

  // Overwritten, hopefully
  this.hashCalculatedCallback = function(hash) {};

  // Split into chunks
  this.chunkFile = function() {
    for(var i = 0; i < this.numChunks(); i++) {
      var chunkData = file.slice(i*chunkSize, (i+1)*chunkSize);
      var chunk = new Chunk(i, chunkData);

      chunk.addStartCallback(this.onChunkStarted.bind(this, chunk));
      chunk.addFinishCallback(this.onChunkFinished.bind(this, chunk));
      chunk.addProgressCallback(this.onChunkProgress.bind(this, chunk));

      chunks.push(chunk);
    }

    state = 'uploading';

    return chunks;
  };
};

