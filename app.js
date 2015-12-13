var App = function() {
  var root = div({cls:'foo'}, "hello");
  var body = document.body;

  var uploader = new Uploader();
  var menu     = new Menu();
  var auth     = new Authentication();

  var header  = div({id:'header'});
  var sidebar = div({id:'sidebar'});
  var footer  = div({id:'footer'}, "footerino");
  var content = div({id:'content'});

  var dom = div({id: 'app'}, header, div({cls:'middle'},sidebar, content), footer);

  var mockedFile = {
      name: 'Mocked File',
      size: '1231',
      type: 'image/jpg',
			state: 'uploading',
      slice: function() { return new Blob(["ddawd"], { type: 'text/plain' }); }
  };

  for ( var i = 0; i < 13; i++ ) {
    uploader.addFile(new UploadFile(mockedFile));
  }

  sidebar.appendChild(menu.render());
  content.appendChild(uploader.render());
  footer.appendChild(auth.render());

  body.appendChild(dom);

};

a = new App();
setTimeout(function() {
  window.scrollTo(0, 10000);
}, 100);

