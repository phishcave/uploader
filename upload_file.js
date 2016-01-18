var __upload_id = 10000;

var UploadFile = function(file) {
  var STATE_QUEUED    = 0;
  var STATE_FINISHED  = 1;
  var STATE_UPLOADING = 2;
  var STATE_PAUSED    = 3;
  var STATE_CANCELED  = 4;

  var chunkSize = 1024 * 1024;
  var chunkSize = 100;
  var startTime;
  var hash;
  var chunks = [];
  var id     = __upload_id += 1;
  var state = STATE_QUEUED;

  // WTF is this?
  this.fakeUpload= function() {
    var b = new Blob(["ddawd"], { type: 'text/plain' });
    chunks.push(new Chunk(1, b));
    chunks.push(new Chunk(2, b));
    chunks.push(new Chunk(3, b));
  }

  this.canStart = function() {
    // has been hashed
    return hash != undefined && hash.length > 0;
  };

  this.start = function() {
    state = STATE_UPLOADING;
  };

  this.resume = function() {
  };

  this.restart = function() {
  };

  this.pause = function() {
    state = STATE_PAUSED ;
  };

  this.cancel = function() {
    for( var i = 0; i < chunks.length; i++ ) {
      chunks[i].cancel();
    }

    state = STATE_CANCELED ;
  }

  this.isQueued    = function() { return state == STATE_QUEUED; };
  this.isUploading = function() { return state == STATE_UPLOADING; };
  this.isFinished  = function() { return state == STATE_FINISHED; };
  this.isPaused    = function() { return state == STATE_PAUSED; };
  this.isCanceled  = function() { return state == STATE_CANCELED; };

  this.id = function() {
    return id;
  };

  this.blob = function() {
    return file.slice();
  };

  this.originalBlob = function() {
    return file;
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
  };

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
    state = STATE_UPLOADING;
  };

  this.onChunkFinished = function(chunk) {
    console.log("chunk finished");
    if ( this.chunksFinished()) {
      this.onFinished();
    }
  };

  this.onFinished = function() {
    console.log("upload finished");
    state = STATE_FINISHED;
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

    return chunks;
  };
};

