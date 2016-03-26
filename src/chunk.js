var Chunk = function(chunk, options) {
  var API_URL = '/chunks';

  var STATE_QUEUED    = 0;
  var STATE_FINISHED  = 1;
  var STATE_UPLOADING = 2;
  var STATE_PAUSED    = 3;
  var STATE_CANCELED  = 4;
  var STATE_ERRORED   = 5;

  var loaded;      // how many bytes were sent
  var startTime;   // when
  var state = STATE_QUEUED;
  var xhr;         // only keep track to abort

  var callbacks = {
    start:    [],
    finish:   [],
    progress: [],
    error:    []
  };

  this.isQueued    = function() { return state == STATE_QUEUED; };
  this.isFinished  = function() { return state == STATE_FINISHED; };
  this.isUploading = function() { return state == STATE_UPLOADING; };
  this.isCanceled  = function() { return state == STATE_CANCELED; };
  this.isPaused    = function() { return state == STATE_PAUSED; };
  this.isErrored   = function() { return state == STATE_ERRORED; };
  this.loaded      = function() { return loaded; };
  this.size        = function() { return chunk.size; };

  this.addFinishCallback = function(handler) {
    callbacks.finish.push(handler);
  };

  this.addStartCallback = function(handler) {
    callbacks.start.push(handler);
  };

  this.addProgressCallback = function(handler) {
    callbacks.progress.push(handler);
  };

  this.addErrorCallback = function(handler) {
    callbacks.error.push(handler);
  };

  this.pause = function() {
    this.abort();
    this.onPause();
  };

  this.cancel = function() {
    this.abort();
  };

  this.abort = function() {
    if ( !this.isUploading() ) {
      return false;
    }

    if ( xhr !== undefined ) {
      xhr.abort();
    }

    this.onAbort();
  };

  this.onProgress = function(e) {
    loaded = e.loaded; // wtf is this?
    var p = new ProgressEvent(e, startTime);

    for ( var i = 0; i < callbacks.progress.length; i++ ) {
      var callback = callbacks.progress[i];
      callback(p);
    }
  };

  this.onError = function(e) {
    state = STATE_ERRORED;

    console.log("error");

    for ( var i = 0; i < callbacks.error.length; i++ ) {
      var callback = callbacks.error[i];
      callback(p);
    }
  };

  this.onAbort = function(e) {
    console.log("abort");
  };

  this.onPause = function(e) {
    console.log("pause");
  };

  // got response from server
  this.onComplete = function(e) {
    state = STATE_FINISHED;

    console.log("finished");

    for ( var i = 0; i < callbacks.finish.length; i++ ) {
      var callback = callbacks.finish[i];
      callback(p);
    }
  };

  this.onStart = function() {
    state = STATE_UPLOADING;

    startTime = Date.now();
    loaded = 0;

    for ( var i = 0; i < callbacks.start.length; i++ ) {
      var callback = callbacks.start[i];
      callback();
    }
  };

  this.onStateChange = function(xhr, evt) {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        this.onComplete(evt);
      } else {
        this.onError(evt);
      }
    }
  };

  this.upload = function() {
    var formData = new FormData();
    formData.append('file_id', options.file_id);
    formData.append('position', options.position);
    formData.append('data', chunk);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', API_URL);

    xhr.upload.addEventListener('progress', this.onProgress.bind(this));
    xhr.upload.addEventListener('error', this.onError.bind(this));
    xhr.upload.addEventListener('abort', this.onAbort.bind(this));
    xhr.addEventListener('readystatechange', this.onStateChange.bind(this, xhr));

    this.onStart();

    xhr.send(formData);
  };
};

