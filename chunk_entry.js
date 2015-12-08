var ChunkEntry = function(chunk) {
  var chunk_dom = div({cls: 'chunk'});
  var chunk_progress_val = span({cls:'val'}, '50%');
  var chunk_progress_bar = span({cls:'bar'}, '');
  var chunk_progress = div(
    {cls:'progress'}, chunk_progress_val, chunk_progress_bar
  );

  this.onStarted = function() {
    this.updateView();
  };

  this.onProgress = function(progress) {
    H.empty(chunk_progress_val);

    chunk_progress_val.appendChild(
      document.createTextNode(progress.percentage())
    );

    chunk_progress_bar.style.width = progress.percentage();
  };

  this.onFinished = function() {
    // state = 'finished';
    // this.updateView();
  };

  chunk.addStartCallback(this.onStarted.bind(this));
  chunk.addProgressCallback(this.onProgress.bind(this));
  chunk.addFinishCallback(this.onFinished.bind(this));

  this.updateView = function() {
    H.empty(chunk_dom);

    if ( chunk.isQueued() ) {
      chunk_dom.appendChild(
        document.createTextNode("queued")
      );
    }

    if ( chunk.isUploading() ) {
      chunk_dom.appendChild(chunk_progress);
    }

    if ( chunk.isFinished() ) {
      chunk_dom.appendChild(
        document.createTextNode("finished")
      );
    }
  };

  this.render = function() {
    this.updateView();
    return chunk_dom;
  };
};
