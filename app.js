var Uploader = function() {
  // List of files in the queue.
  var files = [];
  // List of chunks currently being uploaded.
  var uploading = [];
  // List of chunks for all uploads.
  var chunks = [];
  // The buttons for the uploader (start, pause, stop, etc..)
  var buttons   = div({id: 'options', cls: 'btn-group'});
  // The list of files in the upload queue.
  var queue     = div({id: 'upload-list', cls: 'list'});
  // The hidden file input form used for fetching files.
  var fileInput = input({cls: 'upload-input', type:'file', multiple:'true'});
  // The entire uploader dom. This is what is appended to root.
  var dom       = div({id: 'uploader'}, buttons, queue, fileInput);
  // How many chunks will be uploaded at once.
  var concurrency = 1;

  this.hasFiles = function() {
    return files.length > 0;
  };

  // Changes visible buttons for the uploader by rebuilding the button dom.
  this.updateButtons = function() {
    while(buttons.firstChild) {
      buttons.removeChild(buttons.firstChild);
    }

    buttons.appendChild(
      span({cls:'btn', onclick: this.browse.bind(this)}, icon('folder'), 'BROWSE')
    );

    if (this.hasFiles()) {
      buttons.appendChild(
        span({cls:'btn', onclick: this.start.bind(this)}, 'START')
      );
    }
  };

  // Opens the file browse dialog.
  this.browse = function() {
    fileInput.click();
  };

  // Starts uploading all files.
  this.start = function() {
    console.log("start");
    for ( var i = 0; i < chunks.length; i++ ) {
      var c = chunks[i];

      if ( c.isUploading() || c.isFinished() ) {
        continue;
      }

      this.startChunk(c);
    }
  };

  this.addChunks = function(newChunks) {
    for ( var i = 0; i < newChunks.length; i ++ ) {
      var c = newChunks[i];

      // Don't add chunk twice.
      if ( chunks.indexOf(c) > 0 ) {
        console.log("chunk already in queue");
        continue;
      }

      chunks.push(c);
    }

    this.start();
  };

  // Handler for when file input changes.
  this.onChange = function(evt) {
    var _files = event.target.files;

    for (var i = 0; i < _files.length; i++) {
      var f = new UploadFile(_files[i]);
      this.addFile(f);
    }

    fileInput.value = '';
    this.updateButtons();
  };

  this.chunksFinished = function() {
    var count = 0;

    for ( var i = 0; i < chunks.length; i++ ) {
      if ( chunks[i].isFinished() ) {
        count += 1;
      }
    }

    return count;
  };

  this.chunksInProgress = function() {
    var count = 0;

    for ( var i = 0; i < chunks.length; i++ ) {
      if ( chunks[i].isUploading() ) {
        count += 1;
      }
    }

    return count;
  };

  this.totalChunks = function() {
    return chunks.length;
  };

  this.startChunk = function(chunk) {
    if ( this.chunksInProgress() >= concurrency ) {
      console.log("cannt upload more than " + concurrency + " chunks at once");
      return false;
    }

    if ( chunk.isUploading() ) {
      console.log(chunk);
      console.log("chunk is already uploading");
      return false;
    }

    // Add callbacks
    chunk.addProgressCallback(this.onChunkProgress.bind(this, chunk));
    chunk.addFinishCallback(this.onChunkFinished.bind(this, chunk));
    chunk.addStartCallback(this.onChunkStarted.bind(this, chunk));
    chunk.upload();

    return true;
  };


  this.onChunkProgress = function(chunk, progress) {

  };

  this.onChunkStarted = function(chunk) {

  };

  this.onChunkFinished = function(chunk) {
    console.log("chunk finished");
    this.start();
  };

  // Removes a chunk from the global chunk list
  this.removeChunk = function(chunk) {
    if ( chunk === undefined ) { return; }

    chunks = U.filter(chunks, function(g) {
      return g != chunk;
    });
  };

  // Removes a file from the Uploader.
  this.removeFile = function(file) {
    if ( file === undefined ) { return; }

    // remove chunks from our global list.
    for ( var i = 0; i < file.chunks.length; i++ ) {
      removeChunk(file.chunks[i]);
    }

    // remove file
    files = U.filter(files, function(g) {
      return g != file;
    });

    this.updateButtons();
  };

  // Adds a file to the uploader.
  this.addFile = function(file) {
    files.push(file);

    var e = new UploaderEntry(file);
    var e_dom = e.render();

    e.startChunks = function(chunks) {
      this.addChunks(chunks);
      console.log("adding " + chunks.length + " chunks")
    }.bind(this);

    e.onRemove = function() {
      this.removeFile(file);
      queue.removeChild(e_dom);
    }.bind(this);

    queue.appendChild(e_dom);
  };

  this.render = function() {
    this.updateButtons();
    fileInput.onchange = this.onChange.bind(this);
    return div(dom);
  };
};

var root= div({cls:'foo'}, "hello");
var body = document.body;
var u = new Uploader();

var mockedFile = {
    name: 'Mocked File',
    size: '1231',
    type: 'image/jpg',
    slice: function() { return new Blob(["ddawd"], { type: 'text/plain' }); }
};

u.addFile(new UploadFile(mockedFile));

body.appendChild(u.render());
