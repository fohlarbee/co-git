 
 "use client";
   import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { uploadFile } from '@/lib/firebase';
import { Presentation, Upload } from 'lucide-react';
import React from 'react'
 import {useDropzone} from 'react-dropzone';
import {CircularProgressbar, buildStyles} from 'react-circular-progressbar' 
import { api } from '@/trpc/react';
import useProject from '@/hooks/use-project';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
 const MeetingCard = () => {
    const [progress, setProgress] = React.useState(0);
    const [isUploading, setIsUploading] = React.useState(false);
    const uploadMeeting = api.project.uploadMeeting.useMutation();
    const {projectId} = useProject ();
    const router = useRouter();
    const processMeeting = useMutation({
        mutationFn: async ({ meetingUrl, meetingId, projectId }: { meetingUrl: string, meetingId: string, projectId: string }) => {
            const res = await axios.post('/api/process-meeting', {
                meetingUrl,
                meetingId,
                projectId
            });
            return res.data;
        }
    })
    const {getRootProps, getInputProps} = useDropzone({
        accept:{
            'audio/*': ['.mp3', '.wav', '.m4a']
        },
        multiple: false,
        maxSize:50_000_000, 
        onDrop: async (acceptedFiles) => {
            if (!projectId) return;
            setIsUploading(true);
            console.log(acceptedFiles);
            const file = acceptedFiles[0];
            if (!file) return;  
            const downloadURL = await uploadFile(file as File, setProgress) as string;
            uploadMeeting.mutate({
                projectId,
                meetingUrl: downloadURL,
                name: file.name
            },{
                onSuccess: async (meeting) => {
                    toast.success('Meeting uploaded successfully');
                    router.push(`/meetings`)
                    await processMeeting.mutateAsync({meetingId: meeting.id, meetingUrl: downloadURL, projectId});
                },
                onError: (error) => {
                    toast.error(error.message);
                }
            }
        );
            setIsUploading(false);
        }
    })
  
   return (
    <Card className='col-span-2 flex flex-col items-center justify-center p-10' {...getRootProps()}>
        {!isUploading && (
            <>
                <Presentation className='h-10 w-10 animate-bounce'/>
                <h3 className='mt-2 text-sm font-semibold text-gray-900'>
                    Create a new meeting
                </h3>
                <p className='mt-1 text-center text-sm text-gray-500'>
                    Analyze your meetings with Co-git.
                    <br/>
                    Powered by AI.
                </p>
                <div className="mt-8">
                    <Button disabled={isUploading} variant='outline'>
                        <Upload className='-ml-0.5 mr-1.5 h-5 w-5' aria-hidden={'true'}/>
                            Upload Audio Meeting

                            <input className='hidden' {...getInputProps()}/>

                    </Button>
                </div>
            </>
        )}
        {
            isUploading && (
                <div className="items-center justify-center">
                    <CircularProgressbar
                        value={progress}
                        text={`${progress}%`}
                        styles={buildStyles({
                            textColor: '#1DB954',
                            pathColor: '#1DB954',
                            trailColor: 'rgba(0,0,0,0.1)'
                        })}
                        className='size-20'
                    />
                    <p className='text-sm text-center text-gray-300'>Uploading your Meeting</p>

                </div>
            )
        }
    </Card>
   )
 }
 
 export default MeetingCard;