var UploadChunk = function(chunk, i) {
  var chunkId = i; // id of upload (used internally)
  var loaded;      // how many bytes were sent
  var startTime;   // when
  var state = 'queued';
  var xhr;         // only keep track to abort

  var callbacks = {
    start: [],
    finish: [],
    progress: []
  };

  this.isQueued = function() {
    return state == 'queued';
  };

  this.isFinished = function() {
    return state == 'finished';
  };

  this.isUploading = function() {
    return state == 'uploading';
  };

  this.loaded = function() {
    return loaded;
  };

  this.size = function() {
    return chunk.size;
  };

  this.addFinishCallback = function(handler) {
    callbacks.finish.push(handler);
  };

  this.addStartCallback = function(handler) {
    callbacks.start.push(handler);
  };

  this.addProgressCallback = function(handler) {
    callbacks.progress.push(handler);
  };

  this.abort = function() {
    if ( state != 'uploading' ) {
      return false;
    }

    xhr.abort();
  };

  this.onProgress = function(e) {
    loaded = e.loaded;
    p = new ProgressEvent(e, startTime);

    for ( var i = 0; i < callbacks.progress.length; i++ ) {
      var callback = callbacks.progress[i];
      callback(p);
    }
  };

  this.onError = function(e) {
    console.log("error");
  };

  // got response from server
  this.onComplete = function(e) {
    state = 'finished';

    for ( var i = 0; i < callbacks.finish.length; i++ ) {
      var callback = callbacks.finish[i];
      callback(p);
    }
  };

  this.onStart = function() {
    state = 'uploading';
    startTime = Date.now();
    loaded = 0;

    for ( var i = 0; i < callbacks.start.length; i++ ) {
      var callback = callbacks.start[i];
      callback();
    }
  };

  this.onAbort = function(e) {
    console.log("aborty");
  };

  this.upload = function() {
    var formData = new FormData();
    formData.append('id', chunkId);
    formData.append('data', chunk);

    req = new XMLHttpRequest();
    req.open('POST', 'http://localhost:9292/api/upload');

    req.upload.addEventListener('progress', this.onProgress.bind(this));
    req.upload.addEventListener('error', this.onError.bind(this));
    req.upload.addEventListener('abort', this.onAbort.bind(this));
    req.addEventListener('load', this.onComplete.bind(this));

    this.onStart();

    req.send(formData);
  };
};

