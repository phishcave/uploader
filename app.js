var ProgressEvent = function(e, startTime) {
  var loaded = e.loaded;
  var total = e.total;
  var time = e.timeStamp;

  this.speed = function() {
    if ( startTime === undefined ) {
      return "Unknown";
    }

    var durationSeconds = Math.floor((time - startTime)/1000);
    var bytesPerSecond = loaded / durationSeconds;

    return filesize(bytesPerSecond) + "/S"
  }

  this.percent = function() {
    return loaded / total;
  };

  this.percentage = function() {
    return (this.percent() * 100).toFixed(2) + "%";
  };
}

var UploadFile = function(file) {
  var startTime = undefined;
  var state = 'processing';
  var hash = "";

  // Calculate SHA1 sum of file. (CPU Intensive QQ)
  sha1sum(file, function(sha1) {
    hash  = sha1;
    state = 'ready';
    this.hashCalculatedCallback(hash);
  }.bind(this));

  this.type = function() {
    return mime2name(file.type);
  };

  this.name = function() {
    return file.name;
  };

  this.chunks = function() {
    return 3;
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

  // Overwritten, hopefully
  this.hashCalculatedCallback = function(hash) {};
  this.progressCallback = function(progress) {};
  this.finishedCallback = function() {};

  this.upload = function() {
    var formData = new FormData();
    formData.append('file_no', file.slice(0, file.length));

    var req = new XMLHttpRequest();

    req.open('POST', 'http://localhost:9292/api/upload');

    req.upload.addEventListener('progress', function(e) {
      p = new ProgressEvent(e, startTime);

      this.progressCallback(p);

      console.log(p.percentage());
    }.bind(this));

    req.upload.addEventListener('error', function(e) {
      console.log("erroring")
    });

    req.upload.addEventListener('load', function(e) {
      // finished uploading.
      console.log("loading")
    });

    req.addEventListener('load', function(e) {
      // got response from server
      console.log("not upload loadin enendnedng")
    });

    req.upload.addEventListener('abort', function(e) {
      console.log("aborty")
    });

    state = 'uploading';
    startTime = Date.now();

    req.send(formData);
  };
};

var UploaderEntry = function(file, actions) {
  var state    = 'queued';
  var buttons  = span({cls: 'btn-group'});
  var label    = span({cls: 'label'});
  var progress = span({cls: 'progress'});

  file.hashCalculatedCallback = function() {
    this.updateLabel();
    this.updateButtons();
  }.bind(this);

  file.progressCallback = function(progressEvent) {
    this.updateProgress(progressEvent);
  }.bind(this);

  this.updateProgress = function(progressEvent) {
    while(progress.firstChild) {
      progress.removeChild(progress.firstChild);
    }

    progress.appendChild(
      document.createTextNode(
        progressEvent.speed() + " " + progressEvent.percentage()
      )
    )
  };

  this.updateLabel = function() {
    while(label.firstChild) {
      label.removeChild(label.firstChild);
    }

    label.appendChild(
      span({cls:'name'}, file.name(), file.size())
    );

    label.appendChild(
      span({cls:'state'}, state)
    );

    label.appendChild(
      span({cls:'type'}, file.type())
    );

    label.appendChild(progress);

    label.appendChild(
      span({cls:'hash'}, file.hash())
    );
  };

  this.start = function() {
    state = 'uploading';
    file.upload();
    this.updateButtons();
  };

  this.pause = function() {
    state = 'paused';
    this.updateButtons();
  };

  this.resume = function() {
    state = 'uploading';
    this.updateButtons();
  };

  this.cancel = function() {
    state = 'canceled';
    this.updateButtons();
  };

  this.remove = function() {
    this.onRemove();
  };

  this.updateButtons = function() {
    // remove all buttons
    while(buttons.firstChild) {
      buttons.removeChild(buttons.firstChild);
    }

    switch (state) {
      case 'queued':
        buttons.appendChild(
          span({cls:'btn remove', onclick: this.remove.bind(this)}, icon('delete'), 'Remove')
        );
        if (file.isReady()) {
          buttons.appendChild(
            span({cls:'btn start', onclick: this.start.bind(this)}, icon('file_upload'), 'Start')
          );
        }
        break;
      case 'uploading':
        buttons.appendChild(
          span({cls:'btn pause', onclick: this.pause.bind(this)}, icon('pause'), 'Pause')
        );
        buttons.appendChild(
          span({cls:'btn cancel', onclick: this.cancel.bind(this)}, icon('cancel'), 'Cancel')
        );
        break;
      case 'paused':
        buttons.appendChild(
          span({cls:'btn resume', onclick: this.resume.bind(this)}, icon('play_arrow'), 'Resume')
        );
        buttons.appendChild(
          span({cls:'btn cancel', onclick: this.cancel.bind(this)}, icon('cancel'), 'Cancel')
        );
        break;
      case 'canceled':
        buttons.appendChild(
          span({cls:'btn restart', onclick: this.start.bind(this)}, icon('file_upload'), 'Restart')
        );
        buttons.appendChild(
          span({cls:'btn remove', onclick: this.remove.bind(this)}, icon('delete'),'Remove')
        );
        break;
      default:
        break;
    }
  };

  this.render = function() {
    this.updateLabel();
    this.updateButtons();

    return (
      div({cls: 'upload-entry'}, label, buttons)
    );
  };
};

var Uploader = function() {
  // List of files in the queue.
  var files = [];
  // The buttons for the uploader (start, pause, stop, etc..)
  var buttons   = div({id: 'options', cls: 'btn-group'});
  // The list of files in the upload queue.
  var queue     = div({id: 'upload-list', cls: 'list'});
  // The hidden file input form used for fetching files.
  var fileInput = input({cls: 'upload-input', type:'file', multiple:'true'});
  // The entire uploader dom. This is what is appended to root.
  var dom       = div({id: 'uploader'}, buttons, queue, fileInput);

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
  };

  // Handler for when file input changes.
  this.onChange = function(evt) {
    var _files = event.target.files;

    for (var i = 0; i < _files.length; i++) {
      this.addFile(new UploadFile(_files[i]));
    }

    fileInput.value = '';
    this.updateButtons();

    console.log("browserino");
  };

  // Removes a file from the Uploader.
  this.removeFile = function(file) {
    if ( file === undefined ) { return; }

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

body.appendChild(u.render());
