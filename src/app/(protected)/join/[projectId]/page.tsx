import { db } from '@/server/db';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
    params: Promise<{projectId: string}>
}

const JoinHandler = async ({params}: Props) => {
    const {projectId} = await params;
    const {userId} = await auth();
    if (!userId) return redirect('/sign-in');
    const dbUser = await db.user.findUnique({where:{id: userId}});
    
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    if( !user.emailAddresses[0]?.emailAddress) return redirect('/sign-in');
    if (!dbUser){
        await db.user.create({
            data:{
                id:userId,
                email:user.emailAddresses[0].emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
                imageUrl: user.imageUrl

            }
        })
    }

    const project = await db.project.findUnique({
        where:{id: projectId},

    });
    if (!project) return redirect('/dashboard');
    try {
        await db.userToProject.create({
            data:{
                projectId,
                userId
            }
        });
    } catch (error) {
        // throw new Error('You are already a member of this project');
        console.log('You are already a member of this project');
    }
  return redirect(`/dashboard`);
}

export default JoinHandler