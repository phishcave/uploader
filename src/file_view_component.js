var FileViewComponent = function(args) {
  var file_view = new FileView(args);
  var dom = div({cls: 'file'});

  var buildHeader = function() {
    var title = div(file_view.title());
  };

  file_view.redrawComponent = function() {
    H.empty(dom)

    dom.appendChild(content);
  };

  var dom = div({id: 'file'}, args);

  this.render = function() {
    return dom;
  };
};
