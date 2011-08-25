var http = require('http');

exports.lastBrokenBuild = function(room) {
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
      var buildDate = formatBuildDate(json["timestamp"]);

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

var formatBuildDate = function(timestamp) {
  var monthNames = new Array("January", "February", "March", "April", "May", "June",
                             "July", "August", "September", "October", "November", "December");

  var d = new Date(timestamp);
  var month = d.getMonth();
  var day = d.getDate();
  var year = d.getFullYear();
  var hour = d.getHours();
  var minutes = d.getMinutes();

  if (hour < 12) {
   var meridiem = "AM";
  } else {
   var meridiem = "PM";
  }

  if (hour == 0) {
   hour = 12;
  }

  if (hour > 12) {
    hour = hour - 12;
  }

  minutes = minutes + "";

  if (minutes.length == 1) {
    minutes = "0" + minutes;
  }

  return monthNames[month] + " " + day + ", " + year + " - " + hour + ":" + minutes + " " + meridiem;
}
