if (process.env.CAMPFIRE_ACCT === undefined || process.env.CAMPFIRE_TOKEN === undefined || process.env.CAMPFIRE_ROOM === undefined) {
  console.log("Please set up all Campfire environment variables as specified in the README.");
  process.exit(0);
}

var client = require("ranger").createClient(process.env.CAMPFIRE_ACCT, process.env.CAMPFIRE_TOKEN);

var happyHour = require("./lib/happy_hour.js"),
    rpGithub = require("./lib/repairpal_github.js"),
    misc = require("./lib/miscelaneous.js"),
    weather = require("./lib/weather.js");

client.room(process.env.CAMPFIRE_ROOM, function (room) {
  room.join(function () {
    room.listen(function (message) {
      if (message.type === 'TextMessage' && message.body.match(/^rpbot/i)) {
        var msg = message.body;
        if (msg.match(/last commit/i)) {
          rpGithub.getLastCommitInfo(room);
        } else if (msg.match(/happy hour/i)) {
          happyHour.currentStatus(room);
        } else if (msg.match(/weather/i)) {
          var weatherLocation = msg.replace("rpbot weather ", "");
          if (weatherLocation.match(/rpbot weather/i)) {
            room.speak("Enter a location or zip code to display the current weather conditions (Example: 'rpbot weather Emeryville, CA' or 'rpbot weather 94608')"); 
          } else {
            weather.currentConditions(weatherLocation, room);
          }
        } else if (msg.match(/commands/i)) {
          misc.listCommands(room);
          room.speak("Take some time to hack on my code so I can do more awesome stuff!");
        } else {
          room.speak("I don't understand what you want me to do. Here are some of the things I can do:");
          misc.listCommands(room);
        }
      }
    });
  });
});
