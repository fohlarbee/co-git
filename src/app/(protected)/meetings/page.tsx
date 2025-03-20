"use client";
import useProject from '@/hooks/use-project';
import { api } from '@/trpc/react';
import React from 'react'
import MeetingCard from '../dashboard/meeting-card';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EclipseIcon, EllipsisVerticalIcon, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import useRefresh from '@/hooks/use-refresh';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
                            <div className="flx items-center gap-2 mb-2">
                                <div className="min-w-0 overflow-hidden text-sm font-semibold whitespace-nowrap truncate text-ellipsis max-w-xs md:max-w-lg mb-2">
                                            <Link href={`/meetings/${m.id}`} className='whitespace-nowrap truncate text-ellipsis overflow-hidden m'>
                                                {m.name}
                                            </Link>
                                            
                                </div>
                                {m.status == 'PROCESSING' && (
                                            <Badge className='bg-yellow-500 text-[#fff] ml-3 justify-start'>
                                                Processing...  
                                            </Badge>
                                        )}
                                        {m.status == 'COMPLETED' && (
                                            <Badge className='bg-green-500 text-[#fff] ml-3 justify-start text-left '>
                                                Completed  
                                            </Badge>
                                )}

                            </div>
                                
                            <div className="flex items-center text-xs text-gray-500 gap-x-2">
                                <p className='whitespace-nowrap'>
                                    {m.createdAt.toLocaleDateString()}
                                </p>
                                <p className='truncate'>{m.issues.length} issues</p>

                            </div>
                         </div>   
                        <div className="md:flex items-center flex-none gap-x-4 hidden">
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
                        <div className='md:hidden'>
                             <Popover>
                                <PopoverTrigger asChild>
                                     <EllipsisVerticalIcon className='siz-4 text-primary '/>

                                </PopoverTrigger>
                                <PopoverContent>
                                    <div className='flex flex-col gap-y-2'>
                                            <Link href={`/meetings/${m.id}`}>
                                                 <Button size='sm' variant='outline' className='w-full'>

                                                     View Meeting
                                                 </Button>


                                            </Link>

                                        <Button variant='destructive'
                                                disabled={deleteMeeting.isPending && deleteMeeting.variables?.meetingId === m.id}
                                                size='sm'  onClick={() => deleteMeeting.mutate({meetingId: m.id}, {
                                                onSuccess: () => {
                                                    toast.success('Meeting deleted');
                                                    refresh();
                                                }
                                              })}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </PopoverContent>

                             </Popover>
                        </div>
                    </li>
               )})}

            </ul>
    </>
       
  )
}

export default Meetings;