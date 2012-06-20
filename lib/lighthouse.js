var config = require("../config");
var https = require('https'),
    querystring = require('querystring'),
    xml2js = require('xml2js');

exports.currentMilestone = function(room) {
  var params = querystring.stringify({
    'q': 'milestone:next state:open', // Only get current tickets in the new, open and committed states.
    'limit': 1000 // Just using a big enough number to fetch all tickets and not need any pagination.
  });

  var httpsOptions = {
    host: 'repairpal.lighthouseapp.com',
    port: 443,
    path: '/projects/' + config.lighthouse.project_id + '/tickets.xml?' + params,
    headers: {
      'X-LighthouseToken': config.lighthouse.token
    }
  };

  var getRequest = https.get(httpsOptions, function(res) {
    var data = "";
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      data += chunk;
    });

    res.on('end', function() {
      var parser = new xml2js.Parser();
      parser.parseString(data, function (err, result) {
        var totalTickets = 0;
        var ticketOwners = [];
        var message = "";
        var tickets = result.ticket;

        tickets.each(function(ticket) {
          ticketOwners.add(ticket['assigned-user-name']);
        });

        message += "Remaining tickets in Lighthouse - Current Milestone (new, open and committed states):\n\n";
        ticketOwners.unique().each(function(name) {
          message += name + " - " + ticketOwners.count(name) + " tickets\n";
        });

        room.paste(message);
      });
    });

    res.on('error', function(e) {
      console.log(e);
      room.speak("There was an error getting the ticket info from Lighthouse. Try again later.");
    });
  });
};
