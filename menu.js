var Menu = function() {
  var menuEntries = div({cls: 'items'});
  var dom = div({cls:'menu'}, 'Menu', menuEntries);

  this.addEntry = function(text, path) {
    return div({cls:'entry', url: path}, text);
  };

  this.updateMenu = function() {
    H.empty(menuEntries);

    menuEntries.appendChild(
      this.addEntry("test", "#foo")
    );

    menuEntries.appendChild(
      this.addEntry("foo", "#foo")
    );

    menuEntries.appendChild(
      this.addEntry("bar", "#foo")
    )
  }

  this.render = function() {
    this.updateMenu();
    return dom;
  };
};

