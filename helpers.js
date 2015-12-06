function sha1sum(file, callback) {
	var sha1 = CryptoJS.algo.SHA1.create();
	var read = 0;
	var unit = 1024 * 1024;
	var blob;
	var reader = new FileReader();

	reader.readAsArrayBuffer(file.slice(read, read + unit));
	reader.onload = function(e) {
		var bytes = CryptoJS.lib.WordArray.create(e.target.result);

		sha1.update(bytes);
		read += unit;
		if (read < file.size) {
			blob = file.slice(read, read + unit);
			reader.readAsArrayBuffer(blob);
		} else {
			var hash = sha1.finalize();
			console.log(hash.toString(CryptoJS.enc.Hex)); // print the result
			callback(hash.toString(CryptoJS.enc.Hex));
    }
  };
}

function icon(name) {
  var e = document.createElement('i');
  e.classList.add('material-icons');
  e.appendChild(document.createTextNode(name));
  return e;
}

function mime2name(mime) {
  switch (true) {
    case /^image\//.test(mime):
      return 'image';
    case /^audio\//.test(mime):
      return 'music';
    case /^video\//.test(mime):
      return 'video';
    case /^text\/html/.test(mime):
      return 'html';
    case /^text/.test(mime):
      return 'text';
    case /^application\/zip/.test(mime):
      return 'zip';
    case /^application\/x-rar/.test(mime):
      return 'rar';
    case /^application\/pdf/.test(mime):
      return 'pdf';
    case /^application/.test(mime):
      return 'binary';
    default:
      return 'unknown';
  }
}

