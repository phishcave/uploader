var Authentication = function() {
  var api = "http://127.0.0.1:3001";

  this.onSuccessCallback = function() {};
  this.onFailureCallback = function() {};

  this.onStateChange = function(xhr, evt) {
    if (xhr.readyState == 4) {
      var data = JSON.parse(xhr.response)
      if (xhr.status == 201) {
        this.onSuccessCallback(data);
      } else {
        this.onFailureCallback(data);
      }
    }
  };

  this.request = function(path, data) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', api + path)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(JSON.stringify(data));
    xhr.addEventListener('readystatechange', this.onStateChange.bind(this, xhr));
  };

  this.login = function(username, password) {
    this.request('/sessions', {
      username: username,
      password: password
    });
  };
};

var AuthenticationComponent = function() {
  var auth = new Authentication();
  var loggedIn = false;
  var dom = div({cls:'auth'});
  var errors = div({cls:'errors'})

  auth.onSuccessCallback = function(data) {
    console.log("success");
  }.bind(this);

  auth.onFailureCallback = function(data) {
    H.empty(errors)
    errors.appendChild(span(data.error));
  }.bind(this);

  var onLoginClick = function() {
    H.empty(dom);

    var header = div({cls:'heading'}, "LOGIN")

    var username = input({type:'text', placeholder: 'Username'});
    var password = input({type:'text', placeholder: 'Password'});
    var submit = div({cls:'submit'}, icon('forward'));

    var loginContainer = div({cls:'login-container'}, submit, username, password);

    submit.onclick = function() {
      console.log("username" + username.value);
      console.log("password" + password.value);

      auth.login(username.value, password.value);
    };

    var loginForm = div(header, loginContainer, errors);

    dom.appendChild(loginForm);
  }.bind(this);


  var gravatarUrl = function() {
    return "http://gravatar.com/avatar/1f8377ba373028db1c2598a963c9ee2c";
  };

  var gravatarStyle = function() {
    return {
      backgroundImage: "url('" + gravatarUrl() + "')",
      backgroundSize: '100%'
    };
  };

  this.currentUser = function() {
    return "Anonymous";
  };

  this.updateAuth = function() {
    H.empty(dom);

    if ( loggedIn === true ) {
      var gravatar = span({cls:'gravatar', style:gravatarStyle()});

      var username = span({
        cls:'username', onclick: onUsernameClick.bind(this)
      }, this.currentUser());

      var settings = span({
        cls:'settings right', onclick: onSettingsClick.bind(this)
      }, icon('build'));

      dom.appendChild(div(gravatar, username, settings));
    } else {
      onLoginClick();
      // var login = div("login");
      // login.onclick = onLoginClick;
      // auth.appendChild(login);
    }
  };

  var onSettingsClick = function() {
    alert('not implemented');
  };

  var onUsernameClick = function() {
    alert('not implemented');
  };

  this.render = function() {
    this.updateAuth();

    return dom;
  };
};
