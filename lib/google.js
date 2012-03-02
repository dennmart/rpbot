var config = require("../config");
var https = require('https'),
    querystring = require('querystring'),
    xml2js = require('xml2js');

exports.ie7Percentage = function(room) {
  googleAuth(fetchIE7Stats, room);
};

// Using Google's ClientLogin authorization API - not the best way to deal with this but since
// this is a Campfire bot we can't login to get the info required for OAuth or AuthSub APIs.
var googleAuth = function(callback, room) {
  var postData = querystring.stringify({
    'accountType': 'GOOGLE',
    'Email': config.google.email,
    'Passwd': config.google.password,
    'service': 'analytics',
    'source': 'rpbot'
  });

  var httpsOptions = {
    host: 'www.google.com',
    port: 443,
    path: '/accounts/ClientLogin',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    }
  };

  var postRequest = https.request(httpsOptions, function(res) {
    var data = "";
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      data += chunk;
    });

    res.on('end', function() {
      authToken = data.match(/Auth=\S*/)[0].replace("Auth=", "auth=");
      callback(authToken, room);
    });

    res.on('error', function(e) {
      console.log(e);
      room.speak("There was an error authenticating from Google. Try again later.");
    });
  });

  postRequest.write(postData);
  postRequest.end();
};

var fetchIE7Stats = function(authToken, room) {
  var postData = querystring.stringify({
    'ids': config.google.profile_id,
    'dimensions': 'ga:browser,ga:browserVersion',
    'metrics': 'ga:visits',
    'start-date': Date.create("1 week ago").format("{yyyy}-{MM}-{dd}"),
    'end-date': Date.create("yesterday").format("{yyyy}-{MM}-{dd}"),
    'max-results': '10000'
  });

  var analyticsOptions = {
    host: 'www.google.com',
    port: 443,
    path: '/analytics/feeds/data?' + postData,
    method: 'GET',
    headers: {
      'Authorization': 'GoogleLogin ' + authToken
    }
  };

  https.get(analyticsOptions, function(res) {
    res.setEncoding('utf8');
    
    res.on('data', function (chunk) {
      parser.parseString(chunk);
    });

    res.on('error', function(e) {
      console.log(e);
      room.speak("There was an error fetching the info from Google Analytics. Try again later.");
    });
  });

  var parser = new xml2js.Parser();
  parser.addListener('end', function(result) {
    var ie7Total = 0;
    var allTotal = 0;
    var percentage = 0.0;
    var response = result.entry;

    response.each(function(entry) {
      if (entry.title['#'] == "ga:browser=Internet Explorer | ga:browserVersion=7.0") {
        ie7Total = parseInt(entry['dxp:metric']['@'].value);
      }
      allTotal += parseInt(entry['dxp:metric']['@'].value);
    });

    percentage = (ie7Total / allTotal) * 100;
    room.speak("The percentage of IE7 usage between " + Date.create("1 week ago").format("{Month} {dd}") + " and " + Date.create("yesterday").format("{Month} {dd}") + " was " + percentage.round(3) + "%");
  });
};

exports.youTubeVideo = function(query, room) {
  var params = querystring.stringify({
    'q': escape(query),
    'max-results': 1 // Only get one video for now - might change later on if we want to randomize.
  });

  var youTubeOptions = {
    host: 'gdata.youtube.com',
    port: 443,
    path: '/feeds/api/videos?' + params,
    method: 'GET'
  };

  https.get(youTubeOptions, function(res) {
    res.setEncoding('utf8');
    
    res.on('data', function (chunk) {
      parser.parseString(chunk);
    });

    res.on('error', function(e) {
      console.log(e);
      room.speak("There was an error fetching the info from YouTube. Try again later.");
    });
  });

  var parser = new xml2js.Parser();
  parser.addListener('end', function(result) {
    room.speak(result.entry.link[0]['@'].href);
  });
};

exports.googleImage = function(query, room) {
  var params = querystring.stringify({
    'v': '1.0',
    'q': escape(query),
    'rsz': 8, // Maximum number of results per page, and we only fetch the first page.
    'safe': 'active' // We are at work, after all...
  });

  var googleImagesOptions = {
    host: 'ajax.googleapis.com',
    port: 443,
    path: '/ajax/services/search/images?' + params,
    method: 'GET',
    headers: {
      'Referer': 'http://' + config.campfire.account + '.campfirenow.com/room/' + config.campfire.room_id
    }
  };

  var getRequest = https.get(googleImagesOptions, function(res) {
    var data = "";
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      data += chunk;
    });

    res.on('end', function() {
      var json = JSON.parse(data);
      var imageInfo = json.responseData.results.randomize()[0];
      room.speak(imageInfo.unescapedUrl);
    });

    res.on('error', function(e) {
      console.log(e);
      room.speak("There was an error fetching the info from Google Images. Try again later.");
    });
  });
};
