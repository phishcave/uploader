var FileListEntryComponent = function(file) {
  var fileType = span(file.type);
  var fileAge = span(file.created_at);
  var fileState = span(file.state);
  var fileName = span({cls:'name'}, "(" + file.state + ") ", file.name);
  var fileSize = span({cls:'size'}, filesize(file.size));

  var previewUrl = "/file/" + file.hash;
  var downloadUrl = "/d/" + file.id;

  var previewFile = function(e) {
    e.preventDefault();
    var url = "#file/" + file.hash;
    window.gotoPage(url);
  };

  var downloadFile = function(e) {
    e.preventDefault();
    var url = "/d/" + file.hash;
    window.gotoPage(url);
  };

  var thumb = div({cls: 'thumb'}, 'thumb');
  var dl = span({cls: 'dl'},
    dominate.tags.a({onclick: previewFile, href: previewUrl}, 'Preview'),
    dominate.tags.a({target: '_blank', href: downloadUrl}, 'Download')
  );

  var left = div({cls: 'left'}, thumb, fileName);
  var right = div({cls: 'right'}, fileSize, dl);
  var dom = div({cls: 'file-entry'}, left, right);

  this.render = function() {
    return dom;
  };
};

var FileListComponent = function(id) {
  var table = new TableComponent({columns: [
    {name: 'File Name', property: 'name'},
    {name: 'Size', property: 'size', align: 'center'},
    {name: 'Options', property: 'options', align: 'center'},
  ]});

  var fileList = new FileList(0, 5);
  var pagination = div("pagination");
  var dom = div({id: 'files'});

  this.title = function() {
    return "files";
  };

  var filesLoaded = function(files) {
    H.empty(dom);

    var filez = [];

    for(var i = 0; i < files.length; i++) {
      var file = files[i];
      var fileEntry = {
        name: file.name,
        size: filesize(file.size),
        options: function() { return 'P D'; }
      };

      filez.push(fileEntry);
    }

    dom.appendChild(table.render(filez));
    dom.appendChild(pagination);
  };

  fileList.onLoad = filesLoaded.bind(this);
  fileList.fetch();

  this.render = function() {
    return dom;
  };
};
