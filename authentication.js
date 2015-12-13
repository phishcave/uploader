var Authentication = function() {
  var auth = div({cls: 'auth'});
  var dom = div({cls:'auth-container'}, auth);

  this.currentUser = function() {
    return "Anonymous";
  };

  this.updateAuth= function() {
    H.empty(auth);
    auth.appendChild(span(this.currentUser()));
  };

  this.render = function() {
    this.updateAuth();

    return dom;
  }
};
