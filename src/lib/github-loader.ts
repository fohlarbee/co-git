import {GithubRepoLoader} from '@langchain/community/document_loaders/web/github';
import { Document } from '@langchain/core/documents';
import { generateEmbedding, summarizeCode } from './gemini';
import { db } from '@/server/db';



 const loadGithubRepo = async (githubUrl: string, githubToken?: string) => {
    const loader = new GithubRepoLoader(githubUrl, {
        accessToken: githubToken || '',
        branch: 'main',
        ignoreFiles:['.gitignore', 'README.md', 'package.json', 'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'bun.lockb'],
        recursive: true,
        unknown:'warn',
        maxConcurrency:5
    })

    const docs = await loader.load();
    return docs;
} 


// Document {
//     pageContent: 'import { type ClassValue, clsx } from "clsx"\n' +
//       'import { twMerge } from "tailwind-merge"\n' +
//       '\n' +
//       'export function cn(...inputs: ClassValue[]) {\n' +
//       '  return twMerge(clsx(inputs))\n' +
//       '}\n',
//     metadata: {
//       source: 'lib/utils.ts',
//       repository: 'https://github.com/fohlarbee/GistFiesta',
//       branch: 'main'
//     },
//     id: undefined
//   },  

// console.log( await loadGithubRepo('https://github.com/fohlarbee/GistFiesta'));

export const indexGithubRepo = async (projectId: string, githubUrl: string, githubToken?: string) => {
    const docs = await loadGithubRepo(githubUrl, githubToken);

    const allEmbeddings = await generateEmbeddings(docs);

    await Promise.allSettled(allEmbeddings.map(async (embedding, index) => {
        console.log(`processing ${index} of ${allEmbeddings.length}`);

        if (!embedding) return;

        const sourceCodeEmbedding = await db.sourceCodeEmbedding.create ({
            data:{
                summary: embedding.summary,
                sourceCode: embedding.sourceCode,
                fileName: embedding.fileName,
                projectId,
                        
            }
       });
       await db.$executeRaw`
       UPDATE "SourceCodeEmbedding"
       SET "summaryEmbedding" = ${embedding.embedding}::vector
       WHERE "id" = ${sourceCodeEmbedding.id}
       `
     

    }))
}

const generateEmbeddings = async (docs: Document[]) => {
    const limitedDocs = docs.slice(0, 5);
    return await Promise.all(limitedDocs.map(async (doc) => {
        const summary = await summarizeCode(doc) as string;
        console.log('summary', summary);
        const embedding = await generateEmbedding(summary);
        return {
            summary,
            embedding,
            sourceCode: JSON.parse(JSON.stringify(JSON.stringify(doc.pageContent))),
            fileName: doc.metadata.source
        }
    }));
}