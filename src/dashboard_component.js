var DashboardComponent = function() {
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
    return graphNode;
  };
};
