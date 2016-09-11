var FooterComponent = function() {
  var content = div({cls:'center'}, '☃ zqz.ca 2016');
  var dom  = div({id:'footer'}, div({cls: 'container'}, content));

  return {
    render: function() { return dom; }
  };
};
