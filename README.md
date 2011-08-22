RepairPal Campfire Bot
======================

Just a simple and extensible bot for RepairPal's Campfire chat room, written in [Node.js](http://nodejs.org/).

How to bring the bot to life
----------------------------

* Make sure you have [Node.js](https://github.com/joyent/node) and [NPM](http://npmjs.org/) installed.
* Install all dependencies (`npm install`).
* Set up the following environment variables on your system:
  * **CAMPFIRE_ACCT** - Name of the Campfire account (_http://accountname.campfirenow.com_).
  * **CAMPFIRE_TOKEN** - API token for accessing Campfire's API.
  * **CAMPFIRE_ROOM** - The room number where you want the bot to connect to. To get the room number, simply go to your chat room and note the number at the end of the URL (For example, if the URL is _http://accountname.campfirenow.com/room/123456_, set this variable to _123456_.)
  * **GITHUB_USER** - Set your GitHub username to be able to use GitHub's API (using the [node-github](https://github.com/ajaxorg/node-github) library).
  * **GITHUB_TOKEN** - API token for accessing GitHub's API.
* Run `node index.js` to start.

That should be it! If there are no errors, the bot will connect to the specified Campfire room and listen to any messages. You can view a list of the bot's commands by sending `rpbot commands` to the chat room.
