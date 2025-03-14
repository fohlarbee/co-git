 import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pullCommits } from "@/lib/github";
import { indexGithubRepo } from "@/lib/github-loader";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        projectName: z.string(),
        githubUrl: z.string(),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.create({
        data: {
          githubUrl: input.githubUrl,
          name: input.projectName,
          userToProjects: {
            create: {
              userId: ctx.user.userId!,
            },
          },
        }, 
      });
      await indexGithubRepo(
        project.id,
        input.githubUrl,
        input.githubToken,
      ).catch(console.error);
      await pullCommits(project.id);

      return project;
    }),
  getProjects: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.userId) {
      throw new Error("User ID is undefined. Are you authenticated?");
    }  
    return await ctx.db.project.findMany({
      where: {
        userToProjects: {
          some: {
            userId: ctx.user.userId!,
          },
        },
        deletedAt: null,
      },
    });
  }),

  getCommits: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      await pullCommits(input.projectId).then().catch(console.error);
      return await ctx.db.commit.findMany({
        where: { projectId: input.projectId },
      });
  }),

  saveAnswer:protectedProcedure.input(z.object({
    projectId: z.string(),
    question: z.string(),
    answer: z.string(),
    filesReferences: z.any()
  })).mutation(async ({ctx, input}) => {
    return await ctx.db.question.create({
      data:{
        projectId: input.projectId,
        question: input.question,
        answer: input.answer,
        filesReferences: input.filesReferences,
        userId: ctx.user.userId!
      }
    })
  }),
  getQuestions: protectedProcedure.input(z.object({projectId: z.string()})).
  query(async ({ctx, input}) => {
    return await ctx.db.question.findMany({
      where: {projectId: input.projectId},
      include: {user: true},
      orderBy: {createdAt: 'desc'}  
    })
  }),

  uploadMeeting: protectedProcedure.input(z.object({
    projectId: z.string(),
    meetingUrl: z.string(),
    name: z.string()

     })).mutation(async ({ctx, input}) => {
      const meeting = await ctx.db.meeting.create({
        data:{
          projectId: input.projectId,
          name: input.name,
          meetingUrl: input.meetingUrl,
          status: 'PROCESSING'
        }
         
   })
   return meeting;

  }),
  getMeetings: protectedProcedure.input(z.object({
    projectId: z.string()
    })).query(async ({ctx, input}) => { 
      return await ctx.db.meeting.findMany({
        where:{projectId: input.projectId},
        include: {issues: true},
      })
  }),
  deleteMeeting: protectedProcedure.input(z.object({
    meetingId: z.string()
  })).mutation(async ({ctx, input}) => {
    await ctx.db.issue.deleteMany({
      where: {meetingId: input.meetingId}
    });
    return await ctx.db.meeting.delete({
      where: {id: input.meetingId}
    });

  })
});

