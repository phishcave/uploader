var UploaderSettingsComponent = function(uploader) {

  var checkBox = function(name, value) {
    var currentValue = value;

    var update = function() {
      if (currentValue) {
        box.classList.add('active');
      } else {
        box.classList.remove('active');
      }
    };

    var onClick = function() {
      currentValue = !currentValue;
      update();
    };

    var box = div({cls:'checkbox', onclick: onClick});
    var element = span({cls: 'checkbox-container'}, name, box);
    update();
    return element;
  };

  var instantUpload = div({cls:'checkbox'});
  var dom = div({cls: 'settings right'}, checkBox('Instant Upload', true), checkBox('Redirect', true));

  //instant upload
  //redirect

  var render = function() {
    return dom;
  };

  return {
    render: render,
  };
};
