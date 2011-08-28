RepairPal Campfire Bot (rpbot)
==============================

rpbot is just a simple bot made for our internal Campfire chat room at [RepairPal](http://repairpal.com/), written in [Node.js](http://nodejs.org/).

How to bring rpbot to life
----------------------------

* Make sure you have [Node.js](https://github.com/joyent/node) and [NPM](http://npmjs.org/) installed.
* Install all dependencies (`npm install`). Current NPM packages used:
  * [Ranger](https://github.com/mrduncan/ranger)
  * [node-github](https://github.com/ajaxorg/node-github)
  * [xml2js](https://github.com/Leonidas-from-XIV/node-xml2js)
  * [sugar](http://sugarjs.com/)
* Set up the following environment variables on your system to be able to connect to your specific Campfire room (**required**):
  * **CAMPFIRE_ACCT** - Name of the Campfire account (_http://accountname.campfirenow.com_).
  * **CAMPFIRE_TOKEN** - API token for accessing Campfire's API.
  * **CAMPFIRE_ROOM** - The room number where you want the bot to connect to. To get the room number, simply go to your chat room and note the number at the end of the URL (For example, if the URL is _http://accountname.campfirenow.com/room/123456_, set this variable to _123456_.)
* If you want to use rpbot's GitHub functions, set up the following environment variables on your system (_optional_):
  * **GITHUB_USER** - Set your GitHub username to be able to use GitHub's API (using the [node-github](https://github.com/ajaxorg/node-github) library).
  * **GITHUB_TOKEN** - API token for accessing GitHub's API.
  * **GITHUB_REPO_USER** - Owner of the repository on GitHub you want rpbot to use.
  * **GITHUB_REPO** - Name of the repository you want rpbot to use.
* Run `node index.js` to start.

That should be it! If there are no errors, rpbot will connect to the specified Campfire room and listen to any messages. You can view a list of the bot's commands by sending `rpbot commands` to the chat room.
