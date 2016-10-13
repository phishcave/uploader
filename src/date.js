function pad(number) {
  if (number < 10) {
    return "0" + number;
  }
  return number;
}

function time_zone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

var localized_date = function(date) {
  var ts = new Date(Date.parse(date));

  return ts.getFullYear() +
    '-' + pad(ts.getMonth() + 1) +
    '-' + pad(ts.getDate()) +
    ' ' + pad(ts.getHours()) +
    ':' + pad(ts.getMinutes()) +
    ':' + pad(ts.getSeconds()) +
    ' ' + time_zone();
};

window.localized_date = localized_date;
