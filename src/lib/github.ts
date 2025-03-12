import { db } from "@/server/db";
import { Octokit } from "octokit";
import axios from "axios";
import { aiSummarizeCommit } from "./gemini";
export const octkit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type Response = {
  commitMesssage: string;
  commitHash: string;
  commitAuthorName: string;
  commitAuthorAvaterUrl: string;
  commitDate: string;
};

// const githubUrl = "https://github.com/fohlarbee/GistFiesta.git";

const getCommitHashes = async (githubUrl: string): Promise<Response[]> => {
  const [owner, repo] = githubUrl.split("/").slice(-2);

  if (!owner || !repo) throw new Error("Invalid github url");

  const { data } = await octkit.rest.repos.listCommits({
    owner,
    repo,
  });

  const sortedCommits = data.sort(
    (a: any, b: any) =>
      new Date(b.commit.author?.date).getTime() -
      new Date(a.commit.author?.date).getTime(),
  ) as any[];
  return sortedCommits.slice(0, 10).map((commit) => ({
    commitHash: commit.sha as string,
    commitMesssage: commit.commit.message ?? "",
    commitAuthorName: commit.commit.author?.name ?? "",
    commitAuthorAvaterUrl: commit.author?.avatar_url ?? "",
    commitDate: commit.commit.author?.date ?? "",
  })) as Response[];
};

export const pullCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);

  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes,
  );
  // unprocessedCommits.slice(0, 5);
  const summaryResponses = await Promise.allSettled(
    unprocessedCommits.map((commit) => {
      return summarizeCommit(githubUrl, commit.commitHash);
    }),
  );

  const summaries = summaryResponses.map((res) => {
    if (res.status === "fulfilled") return res.value as string;

    return "";
  });

  const commits = await db.commit.createMany({
    data: summaries.map((summary, index) => {
      console.log(`processing commit ${index}`);
      return {
        projectId,
        commitHash: unprocessedCommits[index]!.commitHash,
        commitMesssage: unprocessedCommits[index]!.commitMesssage,
        commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
        commitAuthorAvaterUrl: unprocessedCommits[index]!.commitAuthorAvaterUrl,
        commitDate: unprocessedCommits[index]!.commitDate,
        commitSummary: summary,
      };
    }),
  });

  return commits;
};

async function summarizeCommit(githubUrl: string, commitHash: string) {
  // Get diff then pass to gemini
  const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
    },
  });

  return (await aiSummarizeCommit(data)) || "";
}

async function fetchProjectGithubUrl(projectId: string) {
  const project = await db.project.findUnique({
    where: { id: projectId },
    select: { githubUrl: true },
  });

  if (!project?.githubUrl) throw new Error("Project has no githubUrl");

  return { project, githubUrl: project?.githubUrl ?? "" };
}

async function filterUnprocessedCommits(
  projectId: string,
  commitHashes: Response[],
) {
  const processedCommits = await db.commit.findMany({
    where: { projectId },
  });

  const unprocessedCommits = commitHashes.filter(
    (commit) =>
      !processedCommits.some(
        (processedCommit) => processedCommit.commitHash === commit.commitHash,
      ),
  );
  return unprocessedCommits;
}
