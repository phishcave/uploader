var FileListComponent = function(id) {
  console.log("lols:" + id);
  var fileList = new FileList(0, 5);

  var dom = div({id: 'files'});

  var addFiles = function(files) {
    H.empty(dom);
    for(var i = 0; i < files.length; i++) {
      var file = files[i];
      addFile(file);
    }
  };

  var addFile = function(file) {
    var fileEntry = div({cls: 'file-entry'}, file.name)
    dom.appendChild(fileEntry);
  };

  fileList.onLoad = addFiles.bind(this);
  fileList.fetch();

  this.render = function() {
    return dom;
  };
};
