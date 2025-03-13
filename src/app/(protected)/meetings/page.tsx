"use client";
import useProject from '@/hooks/use-project';
import { api } from '@/trpc/react';
import React from 'react'
import MeetingCard from '../dashboard/meeting-card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import useRefresh from '@/hooks/use-refresh';

const Meetings = () => {
    const {projectId} = useProject();
    const {data:meetings, isLoading} = api.project.getMeetings.useQuery({projectId}, {
        refetchInterval:4000
    });
    const deleteMeeting = api.project.deleteMeeting.useMutation();
    const refresh = useRefresh();
  return (
    <>
            <MeetingCard/>
            <div className="h-6"></div>
            <h1 className='text-xl font-semibold'>Meetings</h1>
            {meetings && meetings.length === 0 && <div>No meetings found</div>}
            {isLoading && <div>Loading...</div>}
            <ul className='divide-y divide-gray-200'>
                {meetings?.map((m, i) => {
                    return (
                    <li key={i} className='flex items-center justify-between py-5 px-4 gap-x-6 shadow-md border border-opacity-5 rounded-md '>
                         <div>
                                <div className="min-w-0">
                                    <div className="flex-items-center gap-2">
                                         <Link href={`/meetings/${m.id}`} className='text-sm font-semibold whitespace-nowrap truncate text-ellipsis max-w-xs sm:max-w-full'>
                                             {m.name}
                                         </Link>
                                         {m.status == 'PROCESSING' && (
                                            <Badge className='bg-yellow-500 text-[#fff] ml-3'>
                                                Processing...  
                                            </Badge>
                                         )}
                                         {m.status == 'COMPLETED' && (
                                            <Badge className='bg-green-500 text-[#fff] ml-3'>
                                                Completed  
                                            </Badge>
                                         )}
                                    </div>
                                </div>
                                <div className="flex items-center text-xs text-gray-500 gap-x-2">
                                    <p className='whitespace-nowrap'>
                                        {m.createdAt.toLocaleDateString()}
                                    </p>
                                    <p className='truncate'>{m.issues.length} issues</p>

                                </div>
                         </div>   
                        <div className="sm:flex items-center flex-none gap-x-4 hidden">
                            <Link href={`/meetings/${m.id}`}>
                                <Button size='sm' variant='outline'>
                                View Meeting    
                                </Button>
                                         
                            </Link>
                            <Button
                                disabled={deleteMeeting.isPending && deleteMeeting.variables?.meetingId === m.id}
                                size='sm' variant='destructive' onClick={() => deleteMeeting.mutate({meetingId: m.id}, {
                                onSuccess: () => {
                                    toast.success('Meeting deleted');
                                    refresh();
                                }
                             })}>
                                <Trash2 className='size-5' />
                            </Button>
                        </div>
                    </li>
               )})}

            </ul>
    </>
       
  )
}

export default Meetings;