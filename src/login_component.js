var LoginComponent = function(options) {
  var expanded = false;

  var username = input({type:'text'});
  var password = input({type:'text'});

  var onSubmitClick = function() {
    console.log("username" + username.value);
    console.log("password" + password.value);

    app.addError("login", "Incorrect Login Information", "awdwad");
    // login(username.value, password.value);
  };

  var loginGroup = div({cls:'group'}, 'Username', username);
  var passwordGroup = div({cls:'group'}, 'Password', password);

  var submit = div({cls:'submit', onclick: onSubmitClick}, icon('forward'), 'Login');
  var loginContainer = div({cls: 'login-container'}, loginGroup, passwordGroup, submit);

  this.title = function() {
    return "login";
  };

  this.render = function() {
    return loginContainer;
  };
};
