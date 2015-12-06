var UploadFile = function(file) {
	var chunkSize = 100000;

  this.name = function() {
    return file.name;
  };

  this.chunks = function() {
    return 3;
  };

  this.size = function() {
    return filesize(file.size);
  };

  this.upload = function() {
    
  };
};

var UploaderEntry = function(file, actions) {
  var state = 'queued';
  var buttons = span({cls: 'btn-group'});

  this.name = function() {
    return "File: " + file.name() + " - " + file.size();
  };

  this.start = function() {
    state = 'uploading';
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
          span({cls:'btn remove', onclick: this.remove.bind(this)}, 'REMOVE')
        );
        buttons.appendChild(
          span({cls:'btn start', onclick: this.start.bind(this)}, 'START')
        );
        break;
      case 'uploading':
        buttons.appendChild(
          span({cls:'btn pause', onclick: this.pause.bind(this)}, 'PAUSE')
        );
        buttons.appendChild(
          span({cls:'btn cancel', onclick: this.cancel.bind(this)}, 'CANCEL')
        );
        break;
      case 'paused':
        buttons.appendChild(
          span({cls:'btn resume', onclick: this.resume.bind(this)}, 'RESUME')
        );
        buttons.appendChild(
          span({cls:'btn cancel', onclick: this.cancel.bind(this)}, 'CANCEL')
        );
        break;
      case 'canceled':
        buttons.appendChild(
          span({cls:'btn restart', onclick: this.start.bind(this)}, 'RESTART')
        );
        buttons.appendChild(
          span({cls:'btn remove', onclick: this.remove.bind(this)}, 'REMOVE')
        );
        break;
      default:
        break;
    }
  };

  this.render = function() {
    this.updateButtons();

    return (
      div({cls: 'upload-entry'}, this.name(), buttons)
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
      span({cls:'btn', onclick: this.browse.bind(this)}, 'BROWSE')
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
