import {AssemblyAI} from 'assemblyai'
import { channel } from 'diagnostics_channel';
import { start } from 'repl';

const assemblyai = new AssemblyAI({
    apiKey:process.env.ASSEMBLYAI_SECRET_KEY as string
});

function msToTime(ms:number){
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return  `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const transcribeMeeting = async (meetingUrl:string) => {
    const transcript = await assemblyai.transcripts.transcribe({
        audio_url: meetingUrl,
        auto_chapters: true,
    });

    const summaries = transcript.chapters?.map((chapter, index) => ({
        
        start: msToTime(chapter.start),
        end: msToTime(chapter.end),
        gist: chapter.gist,
        headline: chapter.headline,
        summary: chapter.summary
    })) || [];

    if (!transcript.text) throw new Error('No transcript found');
    
    return { summaries};

}