var FileViewComponent = function(args) {
  console.log(args);
  var file_view = new FileView(args);
  var dom = div({id: 'file_show'});

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

    var download = dominate.tags.a({cls: 'download', href: '/d/' + file.slug, target: '_blank'}, 'DOWNLOAD');

    dom.appendChild(download)
  };

  file_view.onLoad = this.update;

  this.render = function() {
    file_view.fetch();
    return dom;
  };
};
