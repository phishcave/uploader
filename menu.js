var Menu = function() {
  heading = function(text) {
    return div({cls:'heading'}, text);
  };

  var menuEntries = div({cls: 'entries'});
  var dom = div({cls:'menu'}, heading('Menu'), menuEntries);

  this.addEntry = function(text, path) {
    var entry = div({cls:'entry', url: path}, text);
    entry.onclick = function() {
      window.location = path;
    };

    return entry;
  };

  this.updateMenu = function() {
    H.empty(menuEntries);

    menuEntries.appendChild(
      this.addEntry("All Files", "#a")
    );

    menuEntries.appendChild(
      this.addEntry("My Files", "#b")
    );

    menuEntries.appendChild(
      this.addEntry("My Albums", "#b")
    );
    menuEntries.appendChild(
      this.addEntry("My Albums", "#b")
    );
    menuEntries.appendChild(
      this.addEntry("My Albums", "#b")
    );

    menuEntries.appendChild(
      this.addEntry("Favourites", "#c")
    )
  }

  this.render = function() {
    this.updateMenu();
    return dom;
  };
};

console.log('hello');
