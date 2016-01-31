var Router = function(container) {
  var routes = {};
  var containter = container;

  var onHashChange = function(e) {
    var hash = window.location.hash.replace(/^#/,'')
    console.log(hash);
    this.navigate(hash);
  }.bind(this);


  window.addEventListener('hashchange', onHashChange);

  this.init = function() {
    onHashChange();
  };

  this.add = function(path, func) {
    routes[path] = func;
  }.bind(this);

  this.renderComponent = function(component) {
    var component = routes[component];
    var c = new component();
    return c.render();
  };

  this.navigate = function(whereTo) {
    H.empty(container);

    var component = this.renderComponent(whereTo);

    container.appendChild(component);
  };
};
