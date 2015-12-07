var UploaderEntry = function(file, actions) {
  var state    = 'queued';
  var buttons  = span({cls: 'btn-group'});
  var label    = div({cls: 'label'});
  var info     = div({cls: 'div'});
  var progress = span({cls: 'progress'});

  file.hashCalculatedCallback = function() {
    this.updateLabel(); // not needed
    this.updateInfo();
    this.updateButtons();
  }.bind(this);

  file.progressCallback = function(progressEvent) {
    this.updateProgress(progressEvent);
  }.bind(this);

  file.finishedCallback = function() {
    state = 'finished';
    this.updateInfo();
    this.updateButtons();
  }.bind(this);

  this.updateProgress = function(progressEvent) {
    while(progress.firstChild) {
      progress.removeChild(progress.firstChild);
    }

    progress.appendChild(
      document.createTextNode(
        progressEvent.speed() + " " + progressEvent.percentage()
      )
    );
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
  };

  this.updateInfo = function() {
    while(info.firstChild) {
      info.removeChild(info.firstChild);
    }

    info.appendChild(
      span({cls:'type'}, file.type())
    );

    info.appendChild(progress);

    info.appendChild(
      span({cls:'hash'}, file.hash())
    );
  };

  this.start = function() {
    state = 'uploading';

    var chunks = file.chunkFile();

    this.startChunks(chunks);
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
          span({cls:'btn remove', onclick: this.remove.bind(this)}, icon('clear'), 'Remove')
        );
        if (file.isReady()) {
          buttons.appendChild(
            span({cls:'btn start', onclick: this.start.bind(this)}, icon('file_upload'), 'Upload')
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
          span({cls:'btn remove', onclick: this.remove.bind(this)}, icon('clear'), 'Remove')
        );
        break;
      case 'finished':
        buttons.appendChild(
          span({cls:'btn remove', onclick: this.remove.bind(this)}, icon('clear'), 'Remove from list')
        );
        break;
      default:
        break;
    }
  };

  this.render = function() {
    this.updateLabel();
    this.updateInfo();
    this.updateButtons();

    return (
      div({cls: 'upload-entry'}, label, info, buttons)
    );
  };
};

