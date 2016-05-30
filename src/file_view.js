var FileView = function(id) {

  this.title = function() {
    return "foo";
  }

  var onGetFile = function(xhr) {
    if (xhr.readyState === 4) {
      if(xhr.status === 200) {
        var file = JSON.parse(xhr.response);
        console.log(file);
      }
    }
  };

  var getFile = function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/file/' + id)
    xhr.addEventListener('readystatechange', onGetFile.bind(this, xhr));
    xhr.send();
  };

  var file = getFile(id);
};
