var ChunkComponent = function(chunk) {
  var container = div({cls: 'chunk'});
  var progressValue = span({cls:'val'}, '50%');
  var progressBar = span({cls:'bar'}, '');
  var progress = div(
    {cls:'progress'}, progressValue, progressBar
  );

  var chunk_state = div();

  this.onError = function() {
    alert("error");
  };

  this.onStart = function() {
    this.updateView();
  };

  this.onProgress = function(progress) {
    H.empty(progressValue);

    progressValue.appendChild(
      document.createTextNode(progress.percentage())
    );

    progressBar.style.width = progress.percentage();
  };

  this.onFinish = function() {
    // state = 'finished';
    // this.updateView();
  };

  chunk.addStartCallback(this.onStart.bind(this));
  chunk.addProgressCallback(this.onProgress.bind(this));
  chunk.addFinishCallback(this.onFinish.bind(this));
  chunk.addErrorCallback(this.onError.bind(this));

  this.updateView = function() {
    H.empty(container);

    if ( chunk.isQueued() ) {
      container.appendChild(
        div({cls:'text'}, 'queued')
      );
    }

    if ( chunk.isUploading() ) {
      container.appendChild(progress);
    }

    if ( chunk.isFinished() ) {
      container.appendChild(
        document.createTextNode("finished")
      );
    }
  };

  this.render = function() {
    this.updateView();
    return container;
  };
};
