var Router = function(container) {
  var routes = {};
  var containter = container;
  var loadedScripts = [];

  var loadedScript = function(scriptName) {
    return loadedScripts.indexOf(scriptName) > 0;
  };

  var loadScript = function(scriptName) {
    return new Promise(function(resolve) {
      var name = scriptName;
      var body = document.body;

      if (loadedScript(name)) {
        return resolve();
      }

      var node = script({type: 'text/javascript', src: "assets/" + scriptName})
      body.appendChild(node);

      return node.onload = function() {
        loadedScripts.push(name);
        return resolve();
      };
    });
  };

  var onHashChange = function(e) {
    var hash = window.location.hash.replace(/^#/,'')
    paths = hash.split('/')
    console.log(paths);
    this.navigate(paths[0], paths.slice(1));
  }.bind(this);

  window.addEventListener('hashchange', onHashChange);

  this.init = function() {
    onHashChange();
  };

  this.add = function(path, dependencies, func) {
    routes[path] = {
      deps: dependencies,
      func: func
    };
  }.bind(this);

  this.renderComponent = function(component, args, callback) {
    var routeInfo = routes[component];
    if ( routeInfo === undefined ) {
      return div("no content");
    }

    var scriptsToLoad = [];
    routeInfo.deps.forEach(function(dep) {
      scriptsToLoad.push(loadScript(dep));
    });

    Promise.all(scriptsToLoad).then(function() {
      var loadFunc = new routeInfo.func();
      var component = new loadFunc(args);
      callback(component.render());
    });
  };

  this.navigate = function(whereTo, args) {
    H.empty(container);

    this.renderComponent(whereTo, args, function(component) {
      container.appendChild(component);
    });
  };
};
