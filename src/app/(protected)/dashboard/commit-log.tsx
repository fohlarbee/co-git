"use client";

 
import useProject from '@/hooks/use-project';
import { cn } from '@/lib/utils';
import { api } from '@/trpc/react';
import { ExternalLinkIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const CommitLog = () => {
    const {projectId, project} = useProject();
    const {data:commits} = api.project.getCommits.useQuery({projectId});
  return (
    <>
        {commits ?
            <ul className='space-y-6'>
            {commits?.map((c, i) => {
                return (
                    <li key={i} className='relative flex gap-x-4'>
                        <div className={cn(
                            i === commits.length - 1 ? 'h-6' : '-bottom-6',
                            "absolute left-0 top-0 flex w-6 justify-center"
                        )}>
                            <div className="w-px translate-x-1 bg-gray-200"></div>

                        </div>
                        <>

                            <img src={c.commitAuthorAvaterUrl} alt="commit avatar" 
                                className='relative mt-4 size-8 flex-none rounded-full bg-gray-50' />
                            <div className="flex-auto rounded-md p-3 ring-1 ring-inset ring-gray-200 bg-[#fff]">
                                <div className="flex justify-between gap-x-4">
                                    <Link target='_blank' href={`${project?.githubUrl}/commits/${c.commitHash}`}
                                        className='py-0.5 text-xs leading-5 text-gray-500'
                                    >
                                        <span className='font-medium text-gray-600'>
                                            {c.commitAuthorName}
                                        </span> {" "}
                                        <span className='inline-flex items-center'>
                                            commited
                                            <ExternalLinkIcon  className='ml-1 size-4' />
                                        </span>
                                    </Link>
                                </div>
                                <span className='font-semibold'>
                                    {c.commitMesssage}
                                </span>
                                <pre className='mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-500'>
                                    {c.commitSummary}
                                </pre>
                                
                            </div>

                        </>
                    </li>
                )
                
            })}
        </ul>

        :

        (
            <div className='flex items-center justify-center w-full h-32'>
                <div className='flex flex-col items-center gap-y-2'>
                    <div className='w-8 h-8'>
                        <Loader2 className='animate-spin size-8 text-primary' />
                    </div>
                    <span className='text-sm font-medium text-gray-500 text-primary'>Loading commits...</span>
                </div>
            </div>
        )
    }

       
    </>
    // <pre>{JSON.stringify(commits,null, 2)}</pre>
  )
}

export default CommitLog