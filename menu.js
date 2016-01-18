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
      this.addEntry("Admin", "#admin")
    );

    menuEntries.appendChild(
      this.addEntry("All Files", "#all")
    );

    menuEntries.appendChild(
      this.addEntry("My Files", "#files")
    );

    menuEntries.appendChild(
      this.addEntry("Albums", "#albums")
    );

    menuEntries.appendChild(
      this.addEntry("Favourites", "#favourites")
    )
  }

  this.render = function() {
    this.updateMenu();
    return dom;
  };
};
