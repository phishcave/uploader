var Authentication = function() {
  var loggedIn = true;
  var auth = div({cls: 'auth'});
  var dom = div({cls:'auth-container'}, auth);


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
