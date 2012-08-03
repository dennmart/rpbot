/*
 Pulls a random joke from icndb.com
*/

var https = require('https');

exports.chuckFact = function(room) {
  https.get({ host: 'api.icndb.com', path: '/jokes/random' }, function(res) {
    var data = "";
  
    res.on('data', function(chunk) {
      data += chunk;           
    });
  
    res.on('end', function() {
      var dataResponse = JSON.parse(data);
      room.speak(dataResponse.value.joke);
    });
  
  }).on('error', function(e) {
    room.speak("Chuck is busy. Do you have the guts to disturb him?");
  });
};
