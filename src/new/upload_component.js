var FileComponent = function(file) {
  var dom = div({cls: 'file'});
  var titleNode = div({cls: 'name'}, file.name);
  var hashNode = div({cls: 'hash'}, file.hash);
  var stateNode = div({cls: 'state'}, file.state);
  var chunksNode = div({cls: 'chunks'});

  var setState = function(state) {
    H.empty(stateNode);
    stateNode.appendChild(div(state));
  };

  var setHash = function(hash) {
    H.empty(hashNode);
    hashNode.appendChild(div(hash));
  };

  var render = function() {
    H.empty(dom);
    dom.appendChild(
      div(titleNode, hashNode, stateNode, chunksNode)
    );
    return dom;
  }

  return {
    setState: setState,
    setHash: setHash,
    render: render
  }
};

var UploaderComponent = function() {
  var dom = div({cls: 'uploads'});
  var fileNodes = {}; // Keep track of file nodes

  this.init = function() {
    var f = {
      name: 'foobar',
      blob: new Blob(["ddawd"], { type: 'text/plain' })
    };

    var f2 = {
      name: 'foobar2',
      blob: new Blob(["ddawdawdadw"], { type: 'text/plain' })
    };

    // View updates when a file was added.
    var fileAdded = function(id, file) {
      var fileNode = new FileComponent(file);
      dom.appendChild(fileNode.render());
      fileNodes[id] = fileNode;

      console.log("adding a file");
    };

    // View updates when a file is hashed.
    var fileHashed = function(id, hash) {
      fileNodes[id].setHash(hash);
    };

    var fileStateChange = function(id, state) {
      fileNodes[id].setState(state);
    };

    var onmessage = function(id, type, payload) {
      switch(type) {
        case 'file:added':
          fileAdded(id, payload);
          break;
        case 'file:hashed':
          fileHashed(id, payload);
          break;
        case 'file:state':
          fileStateChange(id, payload);
          break;
        default:
          console.log("default: " + type);
          console.dir(payload);
          break;
      }
    };

    var u = Uploader(onmessage);

    u.add(f);
    u.add(f2);
    //u.start();
  };

  this.render = function() {
    return div(dom, "hello");
  };
};
