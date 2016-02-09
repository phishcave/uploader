var App = function() {
  var root = div({cls:'foo'}, "hello");
  var body = document.body;

  // var uploader = new UploaderComponent();
  var menu     = new Menu();
  var auth     = new AuthenticationComponent();

  var subheader = span({cls:'sub-header'}, 'Upload Files');
  var header  = div({id:'header', cls: 'shadow'}, subheader, 'ZQZ');
  var sidebar = div({id:'sidebar-fixed'});
  var sidebar_container = div({id:'sidebar'}, sidebar);
  var footer  = div({id:'footer'}, div({cls:'text-tiny center'}, 'copyright 2015 zqz.ca'));
  var content = div({id:'content'});
  var content_container = div({id:'content-container'}, header, content, footer);

  var dom = div({id: 'app'}, sidebar_container, content_container);

  var mockedFile = {
    name: 'Mocked File',
    size: '1231',
    type: 'text/plain',
    state: 'uploading',
    slice: function() { return new Blob(["ddawd"], { type: 'text/plain' }); }
  };

  // for ( var i = 0; i < 1; i++ ) {
  //   uploader.addFile(
  //     new UploadFile(mockedFile)
  //   );
  // }

  var router = new Router(content);

  router.add("", [
    "dashboard_component.js"
  ], function() {
    return DashboardComponent;
  });

  router.add("upload", [
    "progress_event.js",
    "chunk.js",
    "chunk_component.js",
    "upload_file.js",
    "upload_file_preview_component.js",
    "upload_file_component.js",
    "uploader.js",
    "uploader_component.js"
  ], function() {
    return UploaderComponent;
  });

  router.add("register", [
    "registration_component.js"
  ], function() {
    return RegistrationComponent;
  });

  sidebar.appendChild(auth.render());
  sidebar.appendChild(menu.render());
  // content.appendChild(uploader.render());

  router.init();

  body.appendChild(dom);
};

a = new App();

