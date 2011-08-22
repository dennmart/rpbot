var client = require("ranger").createClient(process.env.CAMPFIRE_ACCT, process.env.CAMPFIRE_TOKEN);
var happyHour = require("./lib/happy_hour.js");
var rpGithub = require("./lib/repairpal_github.js");
var misc = require("./lib/miscelaneous.js");

client.room(process.env.CAMPFIRE_ROOM, function (room) {
  room.join(function () {
    room.listen(function (message) {
      if (message.type === 'TextMessage' && message.body.match(/^rpbot/i)) {
        var msg = message.body;
        if (msg.match(/last commit/i)) {
          rpGithub.getLastCommitInfo(room);
        } else if (msg.match(/happy hour/i)) {
          happyHour.currentStatus(room);
        } else if (msg.match(/commands/i)) {
          room.speak("Here's some of the stuff I do:");
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
