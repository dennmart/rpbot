if (process.env.CAMPFIRE_ACCT === undefined || process.env.CAMPFIRE_TOKEN === undefined || process.env.CAMPFIRE_ROOM === undefined) {
  console.log("Please set up all Campfire environment variables as specified in the README.");
  process.exit(0);
}

require('sugar');
var client = require("ranger").createClient(process.env.CAMPFIRE_ACCT, process.env.CAMPFIRE_TOKEN);
var happyHour = require("./lib/happy_hour.js"),
    githubInfo = require("./lib/github_info.js"),
    misc = require("./lib/miscelaneous.js"),
    weather = require("./lib/weather.js"),
    hudson = require("./lib/hudson.js");

client.room(process.env.CAMPFIRE_ROOM, function (room) {
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
