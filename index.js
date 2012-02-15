(function () {
  "use strict";
  
  var connect = require('connect')
    , fs = require('fs')
    , semver = require('semver')
    , request = require('ahr2')
    , server = "http://109.169.56.223:3000"
    , path = __dirname
    , port = 1337
    , curVer = "0.0.1"
    ;

  console.log('Checking for updates...');
  request.get(server + "/version").when(function(err, ahr, data) {
    if(err || data.error == true) {
      console.log('Could not contact update server. Going it alone...');
    }
    if(semver.gt(data.result, curVer)) {
      console.log('Server has a new version. Should update now!');
    }
  });

  if((parseFloat(process.argv[2]) == parseInt(process.argv[2])) && !isNaN(process.argv[2])) {
    port = process.argv[2];
  }

  if(typeof process.argv[3] !== 'undefined' && fs.statSync(process.argv[3]).isDirectory()) {
    if(process.argv[3].substring(0,1) == '/'
    ||(process.platform === 'win32' && /[A-Z]:/.test(process.argv[3].substring(0,2)))) {
      path = process.argv[3];
    } else {
      path = __dirname + '/' + process.argv[3];
    }
  }
  
  connect.createServer(
      connect.static(path)
    , connect.directory(path)
  ).listen(port);

  console.log("Now serving on port " + port + ".");

}());
