function sha1sum(file, callback) {
	var sha1 = CryptoJS.algo.SHA1.create();
	var read = 0;
	var unit = 1024 * 1024;
	var blob;
	var reader = new FileReader();

	reader.readAsArrayBuffer(file.slice(read, read + unit));
	reader.onload = function(e) {
		var bytes = CryptoJS.lib.WordArray.create(e.target.result);

		sha1.update(bytes);
		read += unit;
		if (read < file.size) {
			blob = file.slice(read, read + unit);
			reader.readAsArrayBuffer(blob);
		} else {
			var hash = sha1.finalize();
			console.log(hash.toString(CryptoJS.enc.Hex)); // print the result
			callback(hash.toString(CryptoJS.enc.Hex));
    }
  };
}

function icon(name) {
  var e = document.createElement('i');
  e.classList.add('material-icons');
  e.appendChild(document.createTextNode(name));
  return e;
}

var UploadFile = function(file) {
  var state = 'processing';
  var chunkSize = 100000;
  var reader = new FileReader();
  var hash = "";

  // Calculate SHA1 sum of file. (CPU Intensive QQ)
  sha1sum(file, function(sha1) {
    hash  = sha1;
    state = 'ready';
    this.hashCalculatedCallback(hash);
  }.bind(this));


  this.type = function() {
    switch (true) {
      case /^image\//.test(file.type):
        return 'image';
      case /^audio\//.test(file.type):
        return 'music';
      case /^video\//.test(file.type):
        return 'video';
      case /^text\/html/.test(file.type):
        return 'html';
      case /^text/.test(file.type):
        return 'text';
      case /^application\/zip/.test(file.type):
        return 'zip';
      case /^application\/x-rar/.test(file.type):
        return 'rar';
      case /^application\/pdf/.test(file.type):
        return 'pdf';
      case /^application/.test(file.type):
        return 'binary';
      default:
        return 'unknown';
    }
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

  this.upload = function() {
  
  };
};

var UploaderEntry = function(file, actions) {
  var state = 'queued';
  var buttons = span({cls: 'btn-group'});
  var label = span({cls: 'label'});

  file.hashCalculatedCallback = function() {
    this.updateLabel();
    this.updateButtons();
  }.bind(this);

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
    
    label.appendChild(
      span({cls:'hash'}, file.hash())
    );
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
