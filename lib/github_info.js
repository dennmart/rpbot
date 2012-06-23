var config = require("../config");

exports.getLastCommitInfo = function(room, githubBranch) {
  var util = require("util");
  var GitHubApi = require("github");
  var github = new GitHubApi({
    version: "3.0.0"
  });

  github.authenticate({
    type: "oauth",
    token: config.github.token
  });

  github.repos.getCommits({
    user: config.github.repo_user,
    repo: config.github.repo,
    sha: escape(githubBranch)
  }, function(err, res) {
    var commit = res[0];
    if (commit !== undefined) {
      var commit_info = commit.commit;
      var commit_url = "https://github.com/" + config.github.repo_user + "/" + config.github.repo + "/commit/" + commit.sha;
      room.speak("Last commit info on " + escape(githubBranch) + " branch - " + commit_url);
      room.paste("By " + commit_info.committer.name + " on " + Date.create(commit_info.committer.date).format('{Month} {d}, {yyyy} - {12hr}:{mm} {tt}') + "\n" + commit_info.message);
    } else {
      room.speak("Nothing was found - either the branch name is incorrect, or this is a new repo.");
    }
  });
};
