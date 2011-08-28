var http = require('http');

exports.lastBrokenBuild = function(room) {
console.log(Date.create());
  // Info to our local Hudson box - This should change if rpbot is run outside the network.
  var options = {
    host: '192.168.1.90',
    port: 8080,
    path: '/job/RepairPal/lastFailedBuild/api/json'
  };

  http.get(options, function(res) {
    var data = "";
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on('end', function() {
      var json = JSON.parse(data);
      var buildDate = Date.create(json["timestamp"]).format('{Month} {d}, {YYYY} - {12hr}:{mm} {TT}');

      var guilty = [];
      for (var i = 0; i < json["culprits"].length; i++) {
        guilty[i] = json["culprits"][i].fullName;
      }
      room.speak("The last time the build was broken was on " + buildDate + " by " + guilty.reverse().join(" or "));
    });

  }).on('error', function(e) {
    console.log("Got error: " + e.message);
  });
};
