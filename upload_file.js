var UploadFile = function(file) {
  var chunkSize = 1024 * 1024;
  var startTime;
  var chunks = [];
  var state  = 'processing';
  var hash   = "";

  // Calculate SHA1 sum of file. (CPU Intensive QQ)
  sha1sum(file, function(sha1) {
    hash  = sha1;
    state = 'ready';
    this.hashCalculatedCallback(hash);
  }.bind(this));

  // Progress in relation to all chunks.
  this.progressPercent = function() {
    var loaded = 0;

    for(var i = 0; i < chunks.length; i++) {
      loaded += chunks[i].loaded;
    }

    return loaded / file.size;
  };

  this.type = function() {
    return mime2name(file.type);
  };

  this.name = function() {
    return file.name;
  };

  this.numChunks = function() {
    return Math.ceil(file.size / chunkSize);
  }

  this.chunks = function() {
    return chunks;
  };

  this.size = function() {
    return filesize(file.size);
  };

  this.hash = function() {
    return hash;
  };

  this.isReady = function() {
    return state == 'ready';
  };

  this.onChunkStarted = function(chunk) {
    startTime = Date.now();
  };

  this.onChunkFinished = function(chunk) {
    console.log("chunk finished");
    // start next chunk
  };

  this.onChunkProgress = function(chunk, progress) {

  };

  // Overwritten, hopefully
  this.hashCalculatedCallback = function(hash) {};

  // Split into chunks
  this.chunkFile = function() {
    for(var i = 0; i < this.numChunks(); i++) {
      var chunkData = file.slice(i*chunkSize, (i+1)*chunkSize);
      var chunk = new UploadChunk(i, chunkData);

      chunk.addStartCallback(this.onChunkStarted.bind(this, chunk));
      chunk.addFinishCallback(this.onChunkFinished.bind(this, chunk));
      chunk.addProgressCallback(this.onChunkProgress.bind(this, chunk));

      chunks.push(chunk);
    }

    return chunks;
  };
};

