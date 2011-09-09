RepairPal Campfire Bot (rpbot)
==============================

rpbot is just a simple bot made for our internal Campfire chat room at [RepairPal](http://repairpal.com/), written in [Node.js](http://nodejs.org/).

How to bring rpbot to life
--------------------------

* Make sure you have [Node.js](https://github.com/joyent/node) and [NPM](http://npmjs.org/) installed.
* Install all dependencies (`npm install`). Current NPM packages used:
  * [Ranger](https://github.com/mrduncan/ranger)
  * [node-github](https://github.com/ajaxorg/node-github)
  * [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js)
  * [sugar](http://sugarjs.com/)
* Set up the configuration settings in config.js.
* Run `node index.js` to start.

That should be it! If there are no errors, rpbot will connect to the specified Campfire room and listen to any messages. You can view a list of the bot's commands by sending `rpbot commands` to the chat room.

Keeping rpbot alive
-------------------

Periodically, rpbot will 'die' when there's an occasional disruption in connectivity to Campfire. To have the bot running continuously, you can install [forever](https://github.com/indexzero/forever), a command-line tool that ensures a script runs continuously. To use forever, simply install the package globally (`npm install -g forever`), then run `forever start index.js` to start rpbot as a daemon monitored by forever.

Contributing to rpbot
---------------------

1. [Fork](http://help.github.com/fork-a-repo/) this repository.
2. Create a topic branch (`git checkout -b topicbranch`).
3. Push any changes to the branch(`git push origin topicbranch`).
4. Create a new [pull request](http://help.github.com/send-pull-requests/).
5. You'll be my new BFF :)
