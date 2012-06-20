var http = require('http');

// TODO: Instead of manually updating this, get the command list automatically from each of the exported functions.
exports.listCommands = function(room) {
  var commands = "Usage: rpbot [command]\n\n";
  commands += "Commands:\n";
  commands += "    last commit [branch]     Shows information of the last commit from the specified branch\n";
  commands += "    happy hour               Check if it's time for Happy Hour at the local bar\n";
  commands += "    weather [location]       Shows the current weather conditions for the location\n";
  commands += "    build broken             Shows the last time the build was broken\n";
  commands += "    gi joe                   Gets a random GI Joe PSA YouTube video\n";
  commands += "    ie7 usage                Gets the percentage of Internet Explorer 7 usage from Google Analytics\n";
  commands += "    pivotal current          Displays stats of the current iteration from Pivotal Tracker\n";
  commands += "    lighthouse tickets       Displays stats of open tickets in current milestone from Lighthouse\n";
  commands += "    youtube [query]          Returns the first search result from YouTube from given query\n";
  commands += "    image [query]            Returns a random image from the given query\n";
  commands += "    sax                      Get some sax in your life!\n";
  commands += "    mustachify [image URL]   Mustachify an image\n";
  commands += "    commands                 You're looking at it...\n";
  room.paste(commands);
};

exports.giJoeRandom = function(room) {
  // Random videos of GI Joe PSA parodies - All of them are hilarious :)
  var videos = ["http://www.youtube.com/watch?v=1eA3XCvrK90", "http://www.youtube.com/watch?v=jRrlvv7CwWg",
                "http://www.youtube.com/watch?v=atXIKI2XHj4", "http://www.youtube.com/watch?v=JJQcJBjObEc",
                "http://www.youtube.com/watch?v=wB4HW2ZSvOE", "http://www.youtube.com/watch?v=mIBkfc1x30g",
                "http://www.youtube.com/watch?v=sSMdGCWRLhQ", "http://www.youtube.com/watch?v=N4OPr_QxoFg",
                "http://www.youtube.com/watch?v=YP2gJEcRdUk", "http://www.youtube.com/watch?v=eilZUMqO6Xc",
                "http://www.youtube.com/watch?v=ZqRtMbH4bsc"];
  room.speak(videos.randomize().first());
};

exports.sax = function(room) {
  var sax_stuff = ["http://74.207.244.98/sax/sax_guy_1.gif", "http://74.207.244.98/sax/sax_guy_2.gif", "http://www.youtube.com/watch?v=VrdwhXNt4qw",
                   "http://www.youtube.com/watch?v=vsPp4tfBnGk", "http://www.youtube.com/watch?v=oQdumlpsl60", "http://www.youtube.com/watch?v=7XUfHy-OM24",
                   "http://www.youtube.com/watch?v=pWfFQ6lL70E"];
  room.speak(sax_stuff.randomize().first());
};

exports.mustachify = function(imageUrl, room) {
  var mustachifyOptions = {
    host: 'mustachify.me',
    path: '/?src=' + imageUrl
  };

  var getRequest = http.get(mustachifyOptions, function(res) {
    if (res.statusCode == 200) {
      room.speak("http://mustachify.me/?src=" + imageUrl);
    } else {
      room.speak("Sorry, I couldn't mustachify your request. Please make you include a valid image URL.");
    }
  });
};