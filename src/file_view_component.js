var FilePaths = function(slug) {
  return {
    download: '/d/' + slug,
    preview: '/d/' + slug,
    delete: app.root + 'files/' + slug + '/delete'
  };
};

var FileViewComponent = function(args) {
  if (args === undefined) {
    console.log("File View Arguments should not be undefined!");
    return;
  }

  console.log("Arguments");
  console.dir(args);

  var slug = args[0];
  var paths = new FilePaths(slug);

  var dom = div({id: 'file'});
  var url = dominate.tags.input({type: 'text', cls:''}, 'hello');

  var fileInfoNode = function(file) {
    var name = div('Name: ', file.name);
    var size = div('Size: ', filesize(file.size));
    var date = div('Date: ', localized_date(file.created_at));
    var hash = div('Hash: ', file.hash);
    var url = div('URL:  ', paths.download);
    var views = div('Views: ', 0);

    return div(name, size, date, hash, url, views);
  };

  var previewNode = function(file) {
    var type = mime2name(file.type);

    if (type == 'image') {
      return dominate.tags.img({cls: 'preview', src: paths.download});
    } else {
      return div('No preview available for ' + type);
    }
  };

  var onResponse = function(file) {
    window.setSection(file.name);

    dom.appendChild(previewNode(file));

    var download = dominate.tags.a({cls: 'download', href: paths.download, target: '_blank'}, 'DOWNLOAD');

    var deleteFile = function() {
      console.log("deleting file");
      deleteRequest(paths.delete, function(status, response) {
        if (status == 204) {
          console.log('file deleted!');
        } else {
          console.log('error deleting file');
        }
      });
    };
    var deleteBtn = div({onclick: deleteFile}, 'delete');

    dom.appendChild(download);
    dom.appendChild(deleteBtn);
    dom.appendChild(url);

    dom.appendChild(fileInfoNode(file));
  };

  var onError = function(status) {
    dom.appendChild(div('Failed with error ', status));
  };

  var getData = function() {
    get('/api/v1/files/' + args[0], function(status, data) {
      if (status === 200) {
        onResponse(data);
      } else {
        onError(status);
      }
    });
  };

  return {
    render: function() {
      getData();
      return dom;
    },
    title: function() { return 'loading data'; },
  };
};
