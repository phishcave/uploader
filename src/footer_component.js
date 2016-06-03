var FooterComponent = function() {
  var content = div({cls:'center'}, 'zqz.ca © 2016');
  var footer  = div({id:'footer'}, div({cls: 'container'}, content));

  this.render = function() {
    return footer;
  };
};
