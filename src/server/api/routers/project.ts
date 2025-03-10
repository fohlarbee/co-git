import {z} from 'zod';
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pullCommits } from "@/lib/github";
import { indexGithubRepo } from "@/lib/github-loader";

export const  projectRouter = createTRPCRouter({
 createProject: protectedProcedure.input(
    z.object({
        projectName: z.string(),
        githubUrl: z.string(),
        githubToken: z.string().optional()

    })
 ).mutation(async({ctx, input}) => {
    const project = await ctx.db.project.create({
        data:{
            githubUrl:input.githubUrl,
            name: input.projectName,
            userToProjects: {
                create:{
                    userId:ctx.user.userId!,
                }
            }
            
        }
    });
    await indexGithubRepo(project.id, input.githubUrl, input.githubToken).catch(console.error);
    await pullCommits(project.id);

    return project;
   

 }),
 getProjects: protectedProcedure.query(async ({ctx}) => {
    return await ctx.db.project.findMany({
        where:{
            userToProjects:{
                some:{
                    userId:ctx.user.userId!
                }
            },
            deletedAt: null
        }
    })
 }),

 getCommits: protectedProcedure.input(z.object({
    projectId:z.string()
 })).query(async ({ctx, input}) => {
    await pullCommits(input.projectId).then().catch(console.error);   
    return await ctx.db.commit.findMany({where:{projectId:input.projectId}});
 })
});