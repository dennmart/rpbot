exports.getLastCommitInfo = function(room) {
  var sys = require("sys");
  var GitHubApi = require("github").GitHubApi;
  var github = new GitHubApi(true);

  github.authenticateToken(process.env.GITHUB_USER, process.env.GITHUB_TOKEN);
  github.getCommitApi().getBranchCommits("atavistock", "Repairpal-Rails", "develop", function(err, commits) {
    if (err === null) {
      var commit = commits[0];
      room.paste("By " + commit.committer.name + " on " + new Date(commit.committed_date) + "\n" + commit.message + "\nhttps://github.com" + commit.url);
    } else {
      room.speak("There was an error from GitHub: " + err);
    }
  });
};
