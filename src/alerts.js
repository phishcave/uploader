var Alerts = function(text) {
  var alertsNode = div({id: 'alerts'});
  var alerts = [];

  var close = function() {
    this.parentNode.remove();
  };

  var hasEntry = function(entry) {
    for(var i = 0; i < alerts.length; i++) {
      var a = alerts[i];

      if (a.category === entry.category && a.type === entry.type) {
        return i;
      }
    }

    return -1;
  };

  var update = function() {
    H.empty(alertsNode);

    for(var i = 0; i < alerts.length; i++) {
      var a = alerts[i];
      var ico = null;

      if (a.type === 'alert') {
        ico = icon('info');
      } else if (a.type === 'error') {
        ico = icon('warning');
      }

      var header = div({cls:'header'}, ico, a.title);
      var exit = span({cls: 'close', onclick: close}, icon('clear'));
      var node = div({cls: 'box ' + a.type}, header, a.text, exit);

      alertsNode.appendChild(node);
    }
  };


  var addEntry = function(type, category, title, text) {
    var entry = { type: type, category: category, title: title, text: text };

    var entryPos = hasEntry(entry);

    if (entryPos >= 0) {
      alerts.splice(entryPos, 1);
    }

    alerts.push(entry);

    update();
  };

  this.addAlert = function(category, title, text) {
    addEntry('alert', category, title, text);
  };

  this.addError = function(category, title, text) {
    addEntry('error', category, title, text);
  };

  this.clear = function() {
    H.empty(alertsNode);
  };

  this.render = function() {
    return alertsNode;
  };
};
