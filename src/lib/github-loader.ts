import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { generateEmbedding, summarizeCode } from "./gemini";
import { db } from "@/server/db";
import { github } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { Octokit } from "octokit";
import { octkit } from "./github";

const getFileCount = async (path: string, octokit: Octokit, githubOwner: string, githubRepo: string, acc:number = 0 ) => {
    const {data } = await octokit.rest.repos.getContent({
      owner: githubOwner,
      repo: githubRepo,
      path,
    });
    if (!Array.isArray(data) && data.type == 'file') return acc + 1;
    if (Array.isArray(data)) {
      let fileCount = 0;
      const directories: string[] = [];

      for (const item of data){
        if (item.type == 'dir') directories.push(item.path);
        else fileCount += 1;
      }
      if (directories.length > 0 ){
         const directoriesCounts =await Promise.all(
          directories.map(async (dirPath) => getFileCount(dirPath, octkit, githubOwner, githubRepo, 0) )
         )
         fileCount += directoriesCounts.reduce((acc, count) => (acc ?? 0) + (count ?? 0), 0) ?? 0;
      }
      return acc + fileCount;
    }
    return acc;
}
export const checkCredits = async (githubUrl: string, githubToken?: string) => {
  // How many files are in the repo
  const octokit = new Octokit({auth: githubToken});
  const githubOwner = githubUrl.split("/")[3];
  const githubRepo = githubUrl.split("/")[4];

  if (!githubOwner || !githubRepo) 
    throw new Error("Invalid Github URL");
  
  const fileCount = await getFileCount('', octokit, githubOwner, githubRepo, 0);
  return fileCount;
  // const {data} = await octkit.rest.repos.listFil

}
const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken || "",
    branch: "main",
    ignoreFiles: [
      ".gitignore",
      "README.md",
      "package.json",
      "package-lock.json",
      "yarn.lock",
      "pnpm-lock.yaml",
      "bun.lockb",
    ],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });

  const docs = await loader.load();
  return docs.slice(-10);
};


// console.log( await loadGithubRepo('https://github.com/fohlarbee/GistFiesta'));

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
) => {
  const docs = await loadGithubRepo(githubUrl, githubToken);

  const allEmbeddings = await generateEmbeddings(docs);

  await Promise.allSettled(
    allEmbeddings.map(async (embedding, index) => {
      console.log(`processing ${index} of ${allEmbeddings.length}`);

      if (!embedding) return;

      const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
        data: {
          summary: embedding.summary,
          sourceCode: embedding.sourceCode,
          fileName: embedding.fileName,
          projectId,
        },
      });
      await db.$executeRaw`
       UPDATE "SourceCodeEmbedding"
       SET "summaryEmbedding" = ${embedding.embedding}::vector
       WHERE "id" = ${sourceCodeEmbedding.id}
       `;
    }),
  );
};

const generateEmbeddings = async (docs: Document[]) => {
  return await Promise.all(
    docs.map(async (doc) => {
      const summary = (await summarizeCode(doc)) as string;
      // console.log("summary", summary);
      const embedding = await generateEmbedding(summary);
      return {
        summary,
        embedding,
        sourceCode: JSON.parse(JSON.stringify(JSON.stringify(doc.pageContent))),
        fileName: doc.metadata.source,
      };
    }),
  );
};
