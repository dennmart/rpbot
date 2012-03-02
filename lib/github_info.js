var config = require("../config");

exports.getLastCommitInfo = function(room, githubBranch) {
  var sys = require("sys");
  var GitHubApi = require("github").GitHubApi;
  var github = new GitHubApi(true);

  github.authenticateToken(config.github.user, config.github.token);
  github.getCommitApi().getBranchCommits(config.github.repo_user, config.github.repo, escape(githubBranch), function(err, commits) {
    if (err === null) {
      var commit = commits[0];
      room.speak("Last commit info on " + escape(githubBranch) + " branch - https://github.com" + commit.url);
      room.paste("By " + commit.committer.name + " on " + Date.create(commit.committed_date).format('{Month} {d}, {YYYY} - {12hr}:{mm} {TT}') + "\n" + commit.message);
    } else {
      room.speak("There was an error from GitHub: " + err.msg.error);
    }
  });
};
