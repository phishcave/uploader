var App = function() {
  var root = div({cls:'foo'}, "hello");
  var body = document.body;

  var menu     = new Menu();
  var auth     = new AuthenticationComponent();
  var header   = new HeaderComponent({menu: menu});
  var footer   = new FooterComponent();
  var alerts   = new Alerts();

  var view = div({id:'view'});
  var content = div({id:'content'}, alerts.render(), view);

  var dom = div({id: 'app'}, header.render(), content, footer.render());

  // alerts.addError("This is an error");
  // alerts.addAlert("foobar");

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

  var router = new Router(view);

  router.add("login", ["login.js", "login_component.js"], function() {
    return LoginComponent;
  });

  router.add("file", [
    "file_view.js",
    "file_view_component.js"
  ], function() {
    return FileViewComponent;
  })

  router.add("files", [
    "file_list.js",
    "file_list_component.js"
  ], function() {
    return FileListComponent;
  })

  router.add("", [
    "dashboard_component.js"
  ], function() {
    return DashboardComponent;
  });

  router.add("direct", [
    "p2p_send.js",
    "p2p_recv.js",
    "p2p.js"
  ], function() {
    return P2PComponent;
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

  router.init();

  body.appendChild(dom);

  this.addAlert = alerts.addAlert;
  this.addError = alerts.addError;
};

window.app = new App();

