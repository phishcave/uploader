var Authentication = function() {
  var api = "http://127.0.0.1:3001";

  this.request = function(path, data) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', api + path)
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.send(JSON.stringify(data));
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
  var auth = div({cls: 'auth'});
  var dom = div({cls:'auth-container'}, auth);

  var onLoginClick = function() {
    H.empty(auth);

    var username = input({type:'text'});
    var password = input({type:'text'});
    var submit = div('submit');

    submit.onclick = function() {
      console.log("username" + username.value);
      console.log("password" + password.value);

      auth.login(username.value, password.value);
    };

    var loginForm = div(username, password, submit);

    auth.appendChild(loginForm);
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

  this.updateAuth= function() {
    H.empty(auth);

    if ( loggedIn === true ) {
      var gravatar = span({cls:'gravatar', style:gravatarStyle()});

      var username = span({
        cls:'username', onclick: onUsernameClick.bind(this)
      }, this.currentUser());

      var settings = span({
        cls:'settings right', onclick: onSettingsClick.bind(this)
      }, icon('build'));

      auth.appendChild(div(gravatar, username, settings));
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
