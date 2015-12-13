var App = function() {
  var root = div({cls:'foo'}, "hello");
  var body = document.body;

  var uploader = new Uploader();
  var menu = new Menu();

  var mockedFile = {
      name: 'Mocked File',
      size: '1231',
      type: 'image/jpg',
      slice: function() { return new Blob(["ddawd"], { type: 'text/plain' }); }
  };

  uploader.addFile(new UploadFile(mockedFile));

  this.render = function() {
    body.appendChild(menu.render());
    body.appendChild(uploader.render());
  }
};

a = new App();
a.render();

