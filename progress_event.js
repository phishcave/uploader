var ProgressEvent = function(e, startTime) {
  var loaded = e.loaded;
  var total = e.total;
  var time = e.timeStamp;

  this.speed = function() {
    if ( startTime === undefined ) {
      return "Unknown";
    }

    var durationSeconds = Math.floor((time - startTime)/1000);
    var bytesPerSecond = loaded / durationSeconds;

    return filesize(bytesPerSecond) + "/S";
  };

  this.percent = function() {
    return loaded / total;
  };

  this.percentage = function() {
    return (this.percent() * 100).toFixed(2) + "%";
  };
};
