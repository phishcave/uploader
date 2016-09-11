// var uploadWorker = null;
// var uploadWorkerLoaded = false;
// var uploadWorkerCallbacks = {};

// var Upload = function(obj, callback) {
//   if (obj === undefined) {
//     console.log("Can not upload nothing!");
//     return;
//   }

//   if (!uploadWorkerLoaded) {
//     uploadWorker = new UploadWorker(function(e) {
//       var callbackFunc = uploadWorkerCallbacks[e.id];

//       if (callbackFunc === undefined) {
//         console.log("Failed to find callback func for " + e.data.id);
//         console.dir(e);
//         return;
//       }

//       var id = e.id;
//       var type = e.type;
//       var payload = e.payload;
//       var callback = uploadWorkerCallbacks[id];

//       callback(type, payload);
//     });
//   }

//   var x = new UploadHandler(obj, callback);
//   return x;
// };
