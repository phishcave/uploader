var FileViewComponent = function(args) {
  var file_view = new FileView(args);

  var dom = div({cls: 'file'});

  var buildHeader = function() {
    var title = div(file_view.title());
  };

  var dom = div({id: 'file'}, args);

  this.update = function(file) {
    var title = div(file.name);
    dom.appendChild(title);
  };
  file_view.onLoad = this.update;

  this.render = function() {
    file_view.fetch();
    return dom;
  };
};
