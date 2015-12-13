var App = function() {
  var root = div({cls:'foo'}, "hello");
  var body = document.body;


  var uploader = new Uploader();
  var menu     = new Menu();

  var header  = div({id:'header'}, 'olo');
  var sidebar = div({id:'sidebar'});
  var footer  = div({id:'footer'}, "footerino");
  var content = div({id:'content'});

  var dom = div({id: 'app'}, header, footer, sidebar, content);

  var mockedFile = {
      name: 'Mocked File',
      size: '1231',
      type: 'image/jpg',
      slice: function() { return new Blob(["ddawd"], { type: 'text/plain' }); }
  };

  uploader.addFile(new UploadFile(mockedFile));

  sidebar.appendChild(menu.render());
  content.appendChild(uploader.render());

  body.appendChild(dom);
};

a = new App();

