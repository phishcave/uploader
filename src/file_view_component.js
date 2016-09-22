var FilePaths = function(file) {
  var slug = file.slug;

  return {
    download: function() {
      return '/d/' + file.slug;
    },
    preview: function() {
      return '/d/' + file.slug;
    },
    delete: function() {
      return app.root + 'files/' + slug + '/delete';
    }
  };
};

var FileViewComponent = function(args) {
  if (args === undefined) {
    console.log("File View Arguments should not be undefined!");
    return;
  }

  console.log("Arguments");
  console.dir(args);

  var dom = div({id: 'file'});
  var file_view = new FileView(args);

  var update = function(file) {
    var paths = FilePaths(file);
    var slug = file.url;

    // Since the file is loaded async the title must be set here
    window.setSection(file.name);

    console.dir(file);

    var previewType = mime2name(file.type);

    if (previewType == 'image') {
      var preview = dominate.tags.img({cls: 'preview', src: paths.download()});
      dom.appendChild(preview);
    } else {
      dom.appendChild(div("No Preview Availabile"));
    }

    var download = dominate.tags.a({cls: 'download', href: paths.download(), target: '_blank'}, 'DOWNLOAD');

    var deleteFile = function() {
      console.log("deleting file");
      deleteRequest(paths.delete(), function(status, response) {
        if (status == 204) {
          console.log("file deleted!");
        } else {
          console.log("error deleting file");
        }
      });
    };
    var deleteBtn = div({onclick: deleteFile}, 'delete');

    dom.appendChild(download);
    dom.appendChild(deleteBtn);
  };

  file_view.onLoad = update;

  return {
    render: function() {
      file_view.fetch();
      return dom;
    },
    update: update,
    title: function() { return "loading data"; },
  };
};
