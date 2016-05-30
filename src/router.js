var Router = function(container) {
  var routes = {};
  var containter = container;
  var loadedScripts = [];
  var initialLoad = true;

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

      var node = script({type: 'text/javascript', src: "/assets/" + scriptName})
      body.appendChild(node);

      return node.onload = function() {
        loadedScripts.push(name);
        return resolve();
      };
    });
  };

  window.gotoPage = function(path) {
    this.navigate(path);
  }.bind(this);

  var onHashChange = function(e) {
    var hash = window.location.hash || window.location.pathname;
    window.gotoPage(hash);
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

  this.renderComponent = function(componentName, args, callback) {
    var routeInfo = routes[componentName];
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

      if (component.title === undefined) {
        console.log(componentName + " has no title");
      } else {
        window.setSection(component.title());
      }
      callback(component.render());
    });
  };

  window.onpopstate = function(e){
    if (e.state) {
      this.navigate(e.state.path, true);
    }
  }.bind(this);

  this.setPage = function(path) {
    console.log("inserting history " + path);
    window.history.pushState({ "path": path }, path, path);
  }

  this.navigate = function(path, disableHistory) {
    var url = path.replace(/^(#(\/)?)|(\/)/,'');
    var parts = url.split('/');

    var whereTo = parts[0];
    var args = parts.slice(1);

    H.empty(container);

    this.renderComponent(whereTo, args, function(component) {
      container.appendChild(component);
    });

    if (!initialLoad && !disableHistory) {
      history_path = "/" + whereTo

      if (args.length > 0) {
        history_path += "/" + args
      }

      this.setPage(history_path)
    }

    initialLoad = false;
  };
};
