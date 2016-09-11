var FileViewComponent = function(args) {
  if (args === undefined) {
    console.log("File View Arguments should not be undefined!");
    return;
  }

  console.log(args);
  var file_view = new FileView(args);
  // var dom = div({id: 'file_show'});

  var dom = div({id: 'file'});

  this.title = function() {
    return "loading data";
  };

  this.update = function(file) {
    var slug = file.url;

    // Since the file is loaded async the title must be set here
    window.setSection(file.name);

    console.dir(file);

    var previewType = mime2name(file.type);

    if (previewType == 'image') {
      var preview = dominate.tags.img({cls: 'preview', src: '/d/' + file.slug});
      dom.appendChild(preview);
    } else {
      dom.appendChild(div("No Preview Availabile"));
    }

    var download = dominate.tags.a({cls: 'download', href: '/d/' + file.slug, target: '_blank'}, 'DOWNLOAD');

    dom.appendChild(download);
  };

  file_view.onLoad = this.update;

  this.render = function() {
    file_view.fetch();
    return dom;
  };
};
