import { transcribeMeeting } from "@/lib/assemblyai";
import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodyParser = z.object({
    meetingUrl: z.string(),
    projectId: z.string(),
    meetingId: z.string(),
});


export const maxDuration = 300;  //5 minutes

export async function POST(req: Request){
    const {userId} = await auth();

    if (!userId)
        return NextResponse.json({error: 'Unauthorized'}, {status: 401});

    try {
        const body = await req.json();
        const {meetingUrl, projectId, meetingId} = bodyParser.parse(body);
        const {summaries} =  await transcribeMeeting(meetingUrl);

        await db.issue.createMany({
            data:summaries.map(summary => {
                return {
                    start: summary.start,
                    end: summary.end,
                    gist: summary.gist,
                    headline: summary.headline,
                    summary: summary.summary,
                    meetingId
                }
            })
        });
         await db.meeting.update({
            where: {id: meetingId},
            data:{
                status:'COMPLETED',
                name:summaries[0]! .headline,
            }
         })
         return NextResponse.json({message:'Transcription complete'}, {status: 200});
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: 'Internal Server Error'}, {status: 500});
    }

}