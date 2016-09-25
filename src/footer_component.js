var FooterComponent = function() {
  var info = div({cls: 'left'}, 'foo');
  var content = div({cls:'right'}, '☃ zqz.ca 2016');
  var dom  = div({id:'footer', cls: 'bar'}, div({cls: 'container'}, info, content));

  return {
    render: function() { return dom; }
  };
};
