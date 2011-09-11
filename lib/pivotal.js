var config = require("../config");
var https = require('https'),
    querystring = require('querystring'),
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
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      parser.parseString(chunk);
    });

    res.on('error', function(e) {
      console.log(e);
      room.speak("There was an error getting the iteration info from Pivotal Tracker. Try again later.");
    });
  });

  var parser = new xml2js.Parser();
  parser.addListener('end', function(result) {
    var startDate = Date.create(result.iteration.start['#']).format('{Month} {d}, {YYYY}');
    var finishDate = Date.create(result.iteration.finish['#']).format('{Month} {d}, {YYYY}');
    var stories = result.iteration.stories.story;

    var unassigned = 0;
    var unweighed = 0;
    var story_owners = [];
    var message = "";

    stories.each(function(story) {
      if (story.current_state != "accepted") {
        if (story.owned_by !== undefined) {
          story_owners.add(story.owned_by);
        } else {
          unassigned++;
        }
      }

      if (story.estimate !== undefined && story.estimate['#'] == "-1") {
        unweighed++;
      }
    });

    message += "Stats for current iteration (" + startDate + " - " + finishDate + "):\n\n";
    message += unassigned + " unassigned stories\n";
    message += unweighed + " unweighed stories\n\n";

    story_owners.unique().each(function(name) {
      message += name + " - " + story_owners.count(name) + " stories remaining\n";
    });

    room.paste(message);
  });
};
