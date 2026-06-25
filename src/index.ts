import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config({});
const TOKEN = process.env.ACCESS_TOKEN;

const octokit = new Octokit({ auth: `${TOKEN}` });

async function getRecentPublicEvents(username: string, max = 300) {
  const perPage = 100;
  const events = [];
  let page = 1;
  while (events.length < max) {
    const res = await octokit.activity.listPublicEventsForUser({
      username,
      per_page: perPage,
      page,
    });
    if (res.data.length === 0) break;
    events.push(...res.data);
    if (res.data.length < perPage) break;
    page++;
  }
  return events.slice(0, max);
}

// async function listUserRepos(username: string) {
//   const repos = [];
//   for await (const response of octokit.paginate.iterator(
//     octokit.repos.listForUser,
//     { username, per_page: 100 },
//   )) {
//     repos.push(...response.data);
//   }
//   return repos;
// }

// // get commits authored by username in a repo
// async function getCommitsByAuthor(
//   owner: string,
//   repo: string,
//   author: string,
//   max = 100,
// ) {
//   const commits = await octokit.repos.listCommits({
//     owner,
//     repo,
//     author,
//     per_page: Math.min(max, 100),
//   });
//   return commits.data;
// }

// Example usage
(async () => {
  const username = "hkirat";
  const events = await getRecentPublicEvents(username, 200);
  const repoLink = events[0]?.repo.url
    ?.replace("api.", "")
    .replace("/repos", "");
  console.log("Output: \n");
  console.log(`Fetched ${events.length} public events for ${username}`);
  console.log(
    `Fetched repo of id: ${events[0]?.repo.id} Named <  ${events[0]?.repo.name} > and URL { ${repoLink} } `,
  );

  // const repos = await listUserRepos(username);
  // console.log(
  //   `User has ${repos.length} public repos (listing first 10):`,
  //   repos.slice(0, 10).map((r) => r.full_name),
  // );

  // Example: fetch commits authored by user in their own repo (if any)
  // for (let first in repos) {
  //   if (repos[first]?.id! >= 1) {
  //     const commits = await getCommitsByAuthor(
  //       repos[first]!.owner.login,
  //       repos[first]!.name,
  //       username,
  //       50,
  //     );
  // console.log(commits);
  // console.log(
  //   `Found ${commits.length} commits by ${username} in ${repos[first]?.full_name}`,
  // );
  // }
  // }
})();
