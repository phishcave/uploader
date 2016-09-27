var FooterComponent = function() {
  var info = div({cls: 'left'}, 'foo');
  var content = div({cls:'right'}, '☃ zqz.ca 2016');
  var dom  = div({id:'footer', cls: 'bar'}, div({cls: 'container'}, info, content));

  window.setDetails = function(string) {
    H.empty(info);
    info.appendChild(div(string));
  };

  return {
    render: function() { return dom; }
  };
};
