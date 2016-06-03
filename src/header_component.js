var HeaderComponent = function(options) {
  var menu = options.menu;

  var onClickBanner = function() {
    window.gotoPage('#')
  };

  var banner = span({cls: 'banner', onclick: onClickBanner}, 'ZQZ')
  var section = span({cls: 'section'})
  var user = span({cls: 'user'});

  var left = div({cls:'left'}, banner, section);
  var right = div({cls:'right'}, menu.render(), user);
  var container = div({cls: 'container'}, left, right);

  var header = div({id: 'header'}, container);

  // todo don't expose this on window. expose it on app
  window.setSection = function(title) {
    var title = title.toLowerCase();
    H.empty(section)
    section.appendChild(span(title));

    var parts = ["zqz.ca"];

    if (title.length > 0) {
      parts.push(title);
    }

    document.title = parts.join(" - ");
  };

  this.render = function() {
    return header;
  };
};
