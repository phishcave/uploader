var Dashboard = function() {
  
};

var DashboardEntryComponent = function(data) {
  var thumbnail_url =
    'url("/api/v1/thumbnails/' + data.thumb_id + '")';

  var title = span({cls: 'title'}, data.name);
  var created_at = span(data.created_at);
  var slug = data.slug;

  var onClick = function() {
    window.gotoPage("#file/" + slug);
  };

  var content = div({cls: 'content'}, title);
  var style = null;

  if (data.thumb_id !== null) {
    style = { backgroundImage: thumbnail_url };
  }

  return div({
    cls: 'entry',
    style: style,
    onclick: onClick
  }, content);
};

var DashboardComponent = function(args) {
  console.log("args" + args)
  var dom = div({id: 'dashboard'});

  var update = function(data){
    for (var entry_id in data.data) {
      var entry = data.data[entry_id];
      dom.appendChild(
        new DashboardEntryComponent(entry)
      )
    }

    console.log(data)
    return
  }

  var onLoad = function(text, xhr) {
    if (xhr.status === 200) {
      update(JSON.parse(text))
    } else {
      console.log("failed to retreive dash");
    }
  };

  var fetch = function() {
    I.get('/api/v1/dashboard?per_page=20', onLoad);
  };

  this.init = function() {
    fetch();
  }

  // smoothPlotter.smoothing = 0.3;

  // var data = [];
  var graphNode = div({id: 'graph'});
  // var graph = new Dygraph(
  //   graphNode,
  //   data,
  //   {
  //     fillGraph: true,
  //     plotter: smoothPlotter,
  //     drawAxis: true,
  //     color: 'white',
  //     strokeBorderColor: 'white',
  //     strokeWidth: 1,
  //     fillAlpha: 0.5,
  //     labels: ['Time', 'Mbps']
  //   }
  // );

  // this.start = function() {
  //   var t = new Date();

		// for (var i = 10; i >= 0; i--) {
			// var x = new Date(t.getTime() - i * 1000);
			// data.push([x, Math.random()]);
		// }
			// // It sucks that these things aren't objects, and we need to store state in window.
  //   window.intervalId = setInterval(function() {
  //     var x = new Date();  // current time
  //     var y = Math.random();
  //     data.push([x, y]);
  //     if (data.length > 10) {
  //       data = data.slice(1, data.length);
  //     }
  //     graph.updateOptions( { 'file': data } );
  //   }, 1000);
	// };

  this.render = function() {
    return dom;
  };
};
