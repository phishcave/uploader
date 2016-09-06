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
    alert('starting file');
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

  var setState = function(state) {
    H.empty(stateNode);
    stateNode.appendChild(div(state));
  };

  var setHash = function(hash) {
    H.empty(hashNode);
    hashNode.appendChild(div(hash));
  };

  var renderButtons = function() {
    H.empty(buttonsContainer);

    // Stop buttons depending on states
    buttonsContainer.appendChild(startButton);
    buttonsContainer.appendChild(stopButton);
    buttonsContainer.appendChild(pauseButton);
    buttonsContainer.appendChild(resumeButton);
    buttonsContainer.appendChild(detailsButton);
    buttonsContainer.appendChild(removeButton);
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
    chunkComponents[chunk.id] = c;
    chunksContainerNode.appendChild(c.render());
  };

  return {
    addChunk: addChunk,
    setState: setState,
    setHash: setHash,
    remove: remove,
    render: render
  };
};
