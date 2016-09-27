var Dashboard = function() { };

var DashboardEntryComponent = function(data) {
  var thumbnail_url =
    'url("/api/v1/thumbnails/' + data.thumb_id + '")';

  var title = span({cls: 'title'}, data.name);
  var created_at = span(data.created_at);
  var slug = data.slug;

  var href = "/file/" + slug;

  var onClick = function(e) {
    e.preventDefault();
    window.gotoPage(href);
  };

  var content = div({cls: 'content'}, title);
  var style = null;

  if (data.thumb_id !== null) {
    style = { backgroundImage: thumbnail_url };
  }

  return dominate.tags.a({
    cls: 'entry',
    title: data.name,
    style: style,
    href: href,
    onclick: onClick
  }, content);
};

var DashboardComponent = function(args) {
  var entries = div({id: 'dashboard'});
  var uploader = div('uploader');
  var dom = div(uploader, entries);

  var update = function(data){
    for (var entry_id in data.data) {
      var entry = data.data[entry_id];
      entries.appendChild(
        new DashboardEntryComponent(entry)
      );
    }
  };

  var onLoad = function(status, data) {
    if (status === 200) {
      update(data);
    } else {
      console.log("failed to retreive dash");
    }
  };

  var fetch = function() {
    get('/api/v1/dashboard?per_page=70', onLoad);
  };

  return {
    init: function() {
      fetch();
    },
    render: function() {
      return dom;
    }
  };
};
