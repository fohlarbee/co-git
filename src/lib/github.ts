import { db } from '@/server/db';
import {Octokit} from 'octokit'
export const octkit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

type Response = {
    commitMesssage: string;
    commitHash:     string;
    commitAuthorName: string;
    commitAuthorAvaterUrl: string;
    commitDate: string;
}

const githubUrl = "https://github.com/fohlarbee/GistFiesta.git";


const getCommitHashes = async (url: string): Promise<Response[]> => {

    const {data} = await octkit.rest.repos.listCommits({
        owner:'fohlarbee',
        repo: 'GistFiesta',
    });

    const sortedCommits = data.sort((a: any, b: any) => new Date(b.commit.author?.date).getTime() - new Date(a.commit.author?.date).getTime() ) as any[];
    return sortedCommits.slice(0, 10 ).map((commit) => ({
        commitHash: commit.sha as string,
        commitMesssage: commit.commit.message ?? '',
        commitAuthorName: commit.commit.author?.name ?? '',
        commitAuthorAvaterUrl: commit.author?.avatar_url ?? '',
        commitDate: commit.commit.author?.date ?? ''
    })) as Response[];



}

export const pullCommits = async (projectId: string) => {
    const {project, githubUrl} = await fetchProjectGithubUrl(projectId);

    const commitHashes = await getCommitHashes(githubUrl);
    const unprocessedCommits = await filterUnprocessedCommits(projectId, commitHashes);
     

}

async function fetchProjectGithubUrl(projectId: string) {
    const project = await db.project.findUnique({
        where:{id: projectId},
        select: {githubUrl: true}
    });

    if (!project?.githubUrl) throw new Error('Project has no githubUrl');

    return {project, githubUrl: project?.githubUrl ?? ''};
}


async function filterUnprocessedCommits(projectId: string, commitHashes: Response[]){

    const processedCommits = await db.commit.findMany({
        where: {projectId}
    });

    const unprocessedCommits = commitHashes.filter((commit) => !processedCommits.some((processedCommit) => processedCommit.commitHash === commit.commitHash));
    return unprocessedCommits;
}