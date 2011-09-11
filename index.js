var config = require("./config");
var client = require("ranger").createClient(config.campfire.account, config.campfire.token);
var happyHour = require("./lib/happy_hour.js"),
    githubInfo = require("./lib/github_info.js"),
    misc = require("./lib/miscelaneous.js"),
    weather = require("./lib/weather.js"),
    hudson = require("./lib/hudson.js"),
    analytics = require("./lib/google_analytics.js"),
    pivotal = require("./lib/pivotal.js"),
    lighthouse = require("./lib/lighthouse.js");
require('sugar');

client.room(config.campfire.room_id, function (room) {
  room.join(function () {
    room.listen(function (message) {
      if (message.type === 'TextMessage' && message.body.match(/^rpbot/i)) {
        var msg = message.body.trim();
        
        // GitHub - Information about last commit for specfied branch (or 'develop' branch, by default).
        if (msg.match(/last commit/i)) {
          var branch = msg.replace("rpbot last commit", "").trim() || "develop";
          githubInfo.getLastCommitInfo(room, branch);
        // Simply mentions if it's Happy Hour at our local bar.
        } else if (msg.match(/happy hour/i)) {
          happyHour.currentStatus(room);
        // Shows the current weather conditions for the specified location (or our local weather).
        } else if (msg.match(/weather/i)) {
          var weatherLocation = msg.replace("rpbot weather", "").trim() || "94608";
          weather.currentConditions(weatherLocation, room);
        // Checks the last time the build was broken in our local instance of Hudson.
        } else if (msg.match(/build broken/i)) {
          hudson.lastBrokenBuild(room);
        // Picks a random video of those hilarious GI Joe PSA parodies and shows one in the Campfire room.
        } else if (msg.match(/gi joe/i)) {
          misc.giJoeRandom(room);
        // Gets percentage of Internet Explorer 7 usage, according to Google Analytics.
        } else if (msg.match(/ie7 usage/i)) {
          analytics.ie7Percentage(room);
        // Displays information about the current iteration from Pivotal Tracker.
        } else if (msg.match(/pivotal current/i)) {
          pivotal.currentIteration(room);
        // Displays ticket information for current milestone from Lighthouse.
        } else if (msg.match(/lighthouse tickets/i)) {
          lighthouse.currentMilestone(room);
        // Shows all the commands available to rpbot.
        } else if (msg.match(/commands/i)) {
          misc.listCommands(room);
          room.speak("Take some time to hack on my code so I can do more awesome stuff!");
        // Shows all the commands, too.
        } else {
          room.speak("I don't understand what you want me to do. Here are some of the things I can do");
          misc.listCommands(room);
        }
      // If our build breaks, we get a message, so we play a sad trombone for the guilty party.
      } else if (message.type === 'TextMessage' && message.body.match(/RepairPal #\d*: FAILURE/i)) {
        room.play("trombone");
      }
    });
  });
});
