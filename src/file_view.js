var FileView = function(id) {
  var onGetFile = function(xhr) {
    if (xhr.readyState === 4) {
      if(xhr.status === 200) {
        var file = JSON.parse(xhr.response);
        this.onLoad(file);
        console.log(file);
      }
    }
  };

  return {
    fetch: function() {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/api/v1/files/' + id);
      xhr.addEventListener('readystatechange', onGetFile.bind(this, xhr));
      xhr.send();
    },
    title: function() {
      return "foo"; // is this even used??!
    }
  };
};
