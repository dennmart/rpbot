exports.getLastCommitInfo = function(room, githubBranch) {
  if (process.env.GITHUB_USER === undefined || process.env.GITHUB_TOKEN === undefined ||
      process.env.GITHUB_REPO_USER === undefined || process.env.GITHUB_REPO === undefined) {
    room.speak("Can't get repository information - Some of the GitHub environment variables are missing.");
    return true;
  }

  var sys = require("sys");
  var GitHubApi = require("github").GitHubApi;
  var github = new GitHubApi(true);

  github.authenticateToken(process.env.GITHUB_USER, process.env.GITHUB_TOKEN);
  github.getCommitApi().getBranchCommits(process.env.GITHUB_REPO_USER, process.env.GITHUB_REPO, githubBranch, function(err, commits) {
    if (err === null) {
      var commit = commits[0];
      room.speak("Last commit info on " + githubBranch + " branch - https://github.com" + commit.url);
      room.paste("By " + commit.committer.name + " on " + Date.create(commit.committed_date).format('{Month} {d}, {YYYY} - {12hr}:{mm} {TT}') + "\n" + commit.message);
    } else {
      room.speak("There was an error from GitHub: " + err.msg.error);
    }
  });
};
