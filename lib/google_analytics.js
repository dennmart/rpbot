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
    'Email': process.env.GOOGLE_EMAIL,
    'Passwd': process.env.GOOGLE_PASS,
    'Passwd': 'mls3ede1',
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
  });

  postRequest.write(postData);
  postRequest.end();
};

var fetchIE7Stats = function(authToken, room) {
  var postData = querystring.stringify({
    'ids': 'ga:5138654',
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
    var data = "";
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      parser.parseString(chunk);
    });
  }).on('error', function(e) {
    console.log("Got error: " + e.message);
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
