var config = require("../config");
var https = require('https'),
    xml2js = require('xml2js');

exports.currentIteration = function(room) {
  var httpsOptions = {
    host: 'www.pivotaltracker.com',
    port: 443,
    path: '/services/v3/projects/' + config.pivotal.project_id + '/iterations/current',
    headers: {
      'X-TrackerToken': config.pivotal.token
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
        var startDate = Date.create(result.iteration.start['#']).format('{Month} {d}, {yyyy}');
        var finishDate = Date.create(result.iteration.finish['#']).format('{Month} {d}, {yyyy}');
        var stories = result.iteration.stories.story;

        var unassigned = 0;
        var unweighed = 0;
        var delivered = 0;
        var story_owners = [];
        var message = "";

        stories.each(function(story) {
          if (story.current_state != "accepted") {
            if (story.owned_by !== undefined) {
              story_owners.add(story.owned_by);
            } else {
              unassigned++;
            }

            if (story.current_state == "delivered") {
              delivered++;
            }
          }

          if (story.estimate !== undefined && story.estimate['#'] == "-1") {
            unweighed++;
          }
        });

        message += "Stats for current iteration (" + startDate + " - " + finishDate + "):\n\n";
        message += storiesString(unassigned) + " unassigned\n";
        message += storiesString(unweighed) + " unweighed\n";
        message += storiesString(delivered) + " awaiting acceptance / rejection\n\n";

        story_owners.unique().each(function(name) {
          message += name + " - " + storiesString(story_owners.count(name)) + " remaining\n";
        });

        room.paste(message);
      });
    });

    res.on('error', function(e) {
      console.log(e);
      room.speak("There was an error getting the iteration info from Pivotal Tracker. Try again later.");
    });
  });

  var storiesString = function(number) {
    if (number == 1) {
      return "1 story";
    } else {
      return number + " stories";
    }
  };
};
