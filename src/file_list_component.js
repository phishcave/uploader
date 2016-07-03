var FileListComponent = function(id) {
  var table = new TableComponent({columns: [
    {name: 'File Name', property: 'name'},
    {name: 'Size', property: 'size', align: 'center'},
    {name: 'Options', property: 'options', align: 'right'},
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

    var downloadLink = function(url) {
      return function() {
        window.gotoPage('#file/' + url);
        console.log(url);
      };
    };

    for(var i = 0; i < files.length; i++) {
      var file = files[i];
      var showFile = div({onclick: downloadLink(file.hash)}, file.name);

      var fileEntry = {
        name: showFile,
        size: filesize(file.size),
        options: 'DEL HIDE'
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
