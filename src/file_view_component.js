var FileViewComponent = function(args) {
  var file_view = new FileView(args);
  var dom = div({id: 'file_show'});

  var buildHeader = function() {
    var title = div(file_view.title());
  };

  var dom = div({id: 'file'});

  this.update = function(file) {
    var title = div(file.name);
    var slug = file.url;

    dom.appendChild(title);

    if (file.type == 'image') {
      var preview = dominate.tags.img({cls: 'preview', src: '/d/' + file.slug})
      dom.appendChild(preview);
    } else {
      dom.appendChild(div("No Preview Availabile"));
    }
  };

  file_view.onLoad = this.update;

  this.render = function() {
    file_view.fetch();
    return dom;
  };
};
