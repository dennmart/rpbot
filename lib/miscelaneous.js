exports.listCommands = function(room) {
  var commands = "Usage: rpbot [command]\n\n";
  commands += "Commands:\n";
  commands += "    last commit          Shows information of the last commit to the Repairpal-Rails repository\n";
  commands += "    happy hour           Check if it's time for Happy Hour at The Broken Rack\n";
  commands += "    commands             You're looking at it...\n";
  room.paste(commands);
};
