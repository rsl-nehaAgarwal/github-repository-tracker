const username = process.argv[2];

if (!username) {
  console.error("Please provide a GitHub username.");
  process.exit(1);
}

async function fetchRepositories(username) {
  const url = String.fromCharCode(104,116,116,112,115,58,47,47,97,112,105,46,103,105,116,104,117,98,46,99,111,109,47,117,115,101,114,115,47) + username + String.fromCharCode(47,114,101,112,111,115);
  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("GitHub user not found: " + username);
    }
    throw new Error("GitHub API request failed: " + response.status + " " + response.statusText);
  }

  return response.json();
}

async function fetchOwner(username) {
  const url = String.fromCharCode(104,116,116,112,115,58,47,47,97,112,105,46,103,105,116,104,117,98,46,99,111,109,47,117,115,101,114,115,47) + username;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("GitHub owner API request failed: " + response.status + " " + response.statusText);
  }

  return response.json();
}

async function refreshData() {
  try {
    const repositories = await fetchRepositories(username);
    const owner = await fetchOwner(username);
    console.log("Tracking GitHub repositories for: " + username);
    console.log("Owner: " + (owner.name || owner.login));
    console.log("Bio: " + (owner.bio || "No bio"));
    console.log("Public repositories: " + owner.public_repos);
    console.log("Followers: " + owner.followers);
    console.log("Following: " + owner.following);
    console.log("Public repositories found: " + repositories.length);

    if (repositories.length === 0) {
      console.log("No public repositories found.");
      return;
    }

    repositories.forEach(function (repo) {
      console.log("---");
      console.log("Name: " + repo.name);
      console.log("Description: " + (repo.description || "No description"));
      console.log("Language: " + (repo.language || "Not specified"));
      console.log("Stars: " + repo.stargazers_count);
      console.log("URL: " + repo.html_url);
    });
  } catch (error) {
    console.error("Error: " + error.message);
  }
}

refreshData();
setInterval(refreshData, 60000);
