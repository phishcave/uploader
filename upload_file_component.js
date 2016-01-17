var UploadFileComponent = function(file, actions) {
  var buttons  = div({cls: 'btn-group'});
  var label    = div({cls: 'label'});
  var preview  = div({cls: 'preview'});
  var info     = div({cls: 'info'});
  var chunks   = div({cls: 'chunks'});
  var progress = span({cls: 'progress'});

  var infoOpen = true;

  file.hashCalculatedCallback = function() {
    this.updateLabel(); // not needed
    this.updateInfo();
    this.updateButtons();
  }.bind(this);

  file.progressCallback = function(progressEvent) {
    this.updateProgress(progressEvent);
  }.bind(this);

  file.finishedCallback = function() {
    this.updateInfo();
    this.updateButtons();
  }.bind(this);

  this.updateProgress = function(progressEvent) {
    H.empty(progress);

    progress.appendChild(
      document.createTextNode(
        progressEvent.speed() + " " + progressEvent.percentage()
      )
    );
  };

  this.updateLabel = function() {
    H.empty(label);
    H.empty(preview);

    preview.appendChild(
      span(file.type())
    );

    var stateStr = "not defined";

    if ( file.isUploading() ) {
      stateStr = "UPLOADING";
    }

    if ( file.isCanceled() ) {
      stateStr = "CANCELED";
    }

    if ( file.isQueued() ) {
      stateStr = "QUEUED";
    }

    if ( file.isPaused() ) {
      stateStr = "PAUSED";
    }

    if ( file.isFinished() ) {
      stateStr = "FINISHED";
    }

    label.appendChild(
      span({cls:'state'}, stateStr)
    );
    label.appendChild(
      div({cls:'name'}, file.name())
    );
  };

  this.updateInfo = function() {
    H.empty(info);

    if (file.isQueued()) {
      info.appendChild(progress);

      info.appendChild(
        div({cls:'hash'}, file.hash())
      );
      info.appendChild(
        div({cls:'size'}, file.size())
      );
    }

    if (file.isUploading()) {
      info.appendChild(chunks);
    }

    if (file.isFinished()) {
      info.appendChild(
        document.createTextNode("finished")
      );
    }
  };

  this.start = function() {
    file.start();
    // chunkFile sets state to started
    var fileChunks = file.chunkFile();
    var numChunks = fileChunks.length;

    for ( var i = 0; i < numChunks; i++ ) {
      var chunk = fileChunks[i];
      var chunk_dom = new ChunkComponent(chunk);
      chunks.appendChild(chunk_dom.render());
    }

    this.startChunks(fileChunks);
    this.updateInfo();
    this.updateButtons();
  };

  this.pause = function() {
    file.pause();
    this.updateButtons();
  };

  this.resume = function() {
    file.resume();
    this.updateButtons();
  };

  this.cancel = function() {
    file.cancel();
    this.updateButtons();
  };

  this.remove = function() {
    file.cancel();
    this.onRemove();
  };

  this.updateButtons = function() {
    // remove all buttons
    H.empty(buttons);

    buttons.appendChild(
      span({cls:'btn stats', onclick: this.remove.bind(this)}, icon('info'), 'Stats')
    );

    if (file.isQueued()) {
      buttons.appendChild(
        span({cls:'btn remove', onclick: this.remove.bind(this)}, icon('clear'), 'Remove')
      );

      if (file.canStart()) {
        buttons.appendChild(
          span({cls:'btn start', onclick: this.start.bind(this)}, icon('file_upload'), 'Upload')
        );
      }
    }

    if (file.isUploading()) {
      buttons.appendChild(
        span({cls:'btn pause', onclick: this.pause.bind(this)}, icon('pause'), 'Pause')
      );
      buttons.appendChild(
        span({cls:'btn cancel', onclick: this.cancel.bind(this)}, icon('cancel'), 'Cancel')
      );
    }

    if (file.isPaused()) {
      buttons.appendChild(
        span({cls:'btn resume', onclick: this.resume.bind(this)}, icon('play_arrow'), 'Resume')
      );
      buttons.appendChild(
        span({cls:'btn cancel', onclick: this.cancel.bind(this)}, icon('cancel'), 'Cancel')
      );
    }

    if (file.isCanceled()) {
      buttons.appendChild(
        span({cls:'btn restart', onclick: this.start.bind(this)}, icon('file_upload'), 'Restart')
      );
      buttons.appendChild(
        span({cls:'btn remove', onclick: this.remove.bind(this)}, icon('clear'), 'Remove')
      );
    }

    if (file.isFinished()) {
      buttons.appendChild(
        span({cls:'btn remove', onclick: this.remove.bind(this)}, icon('clear'), 'Remove from list')
      );
    }
  };

  this.render = function() {
    this.updateLabel();
    this.updateInfo();
    this.updateButtons();

    var container = div({cls: 'container'}, label, info, buttons);
    return (
      div({cls: 'upload-file'}, preview, container)
    );
  };
};

