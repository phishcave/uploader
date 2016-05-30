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
  var header = div({id: 'header'}, left, right);

  window.setSection = function(title) {
    var title = title.toLowerCase();
    H.empty(section)
    section.appendChild(span(title));
    document.title = "zqz.ca - " + title;
  };

  this.render = function() {
    return header;
  };
};
