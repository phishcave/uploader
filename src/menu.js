var Menu = function() {
  var items = [];
  var menu = div({cls:'menu'});

  var addItem = function(text, path) {
    var item = span({cls:'item', url: path}, text);

    item.onclick = function(e) {
      window.gotoPage(path);
    };

    items.push(item);
  };

  this.update = function() {
    items = [];

    addItem("All Files", "/files");
    addItem("Upload", "/upload");
    addItem("Sign In", "/login");
  };

  this.render = function() {
    this.update();
    H.empty(menu);

    for (var i = 0; i < items.length; i++) {
      menu.appendChild(items[i]);
    }

    return menu;
  };
};

