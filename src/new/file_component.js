var FileComponent = function(uploader, file) {
  var dom = div({cls: 'file'});
  var titleNode = div({cls: 'name'}, file.name);
  var hashNode = div({cls: 'hash'}, file.hash);
  var stateNode = div({cls: 'state'}, file.state);
  var buttonsContainer = div({cls:'x'});
  var chunksContainerNode = div({cls: 'chunks'});
  var chunkComponents = {};

  var clickRemove = function() {
    console.log("Removing File");
    file.handler.remove();
  };

  // The user has started the upload.
  var clickStart = function() {
    console.log("Starting File");
    file.handler.start();
  };

  // The user has paused their upload.
  var clickPause = function() {
    console.log("Pausing File");
    alert('pausing file');
  };

  // The user has stopped the upload. (pause/stop are the same thing)
  var clickStop = function() {
    console.log("Stopping File");
    alert('stopping file');
  };

  // The user has resumed the file.
  var clickResume = function() {
    console.log("Resuming File");
    alert('resuming file');
  };

  // The user clicked the details view.
  var clickDetails = function() {
    console.log("Viewing Details");
    alert('viewing details');
  };

  var removeButton = div({cls:'btn', onclick: clickRemove}, 'X');
  var startButton = div({cls:'btn', onclick: clickStart}, 'Start');
  var stopButton = div({cls:'btn', onclick: clickStop}, 'Stop');
  var resumeButton = div({cls:'btn', onclick: clickResume}, 'Resume');
  var detailsButton = div({cls:'btn', onclick: clickDetails}, 'Details');
  var pauseButton = div({cls:'btn', onclick: clickPause}, 'Pause');

  var setState = function() {
    H.empty(stateNode);
    stateNode.appendChild(div(file.state));
    renderButtons();
  };

  var setHash = function() {
    H.empty(hashNode);
    hashNode.appendChild(div(file.hash));
  };

  var renderButtons = function() {
    H.empty(buttonsContainer);

    var canStart = file.state !== 'finished' && file.state !== 'uploading';
    if (canStart) {
      buttonsContainer.appendChild(startButton);
    }

    var canStop = file.state === 'uploading';
    if (canStop) {
      buttonsContainer.appendChild(stopButton);
    }

    var canPause = file.state === 'uploading';
    if (canPause) {
      buttonsContainer.appendChild(pauseButton);
    }

    var canResume = file.state === 'paused';
    if (canResume) {
      buttonsContainer.appendChild(resumeButton);
    }

    buttonsContainer.appendChild(detailsButton);

    var canRemove = file.state === 'finished' || file.state == 'new';
    if (canRemove) {
      buttonsContainer.appendChild(removeButton);
    }
  };

  var render = function() {
    H.empty(dom);

    renderButtons();

    dom.appendChild(
      div(titleNode, hashNode, stateNode, chunksContainerNode, buttonsContainer)
    );

    return dom;
  };

  var remove = function() {
    dom.parentNode.removeChild(dom);
  };

  var addChunk = function(chunk) {
    var c = new ChunkComponent(chunk);
    chunkComponents[chunk.hash] = c;
    chunksContainerNode.appendChild(c.render());
  };

  var finishChunk = function(chunk) {
    var c = chunkComponents[chunk.hash];
    c.finish();
  };

  return {
    addChunk: addChunk,
    finishChunk: finishChunk,
    setState: setState,
    setHash: setHash,
    remove: remove,
    render: render
  };
};
