import useProject from '@/hooks/use-project'
import { api } from '@/trpc/react';
import React from 'react'

const TeamMembers = () => {
    const {projectId} = useProject();
    const {data:members, isLoading} = api.project.getTeamMembers.useQuery({projectId});
  return (
    <div className='flex items-center gap-2'>
        {members?.map((m, i) => {
            return (
            <img key={i} src={m.user.imageUrl!} alt={m.user.firstName!}
             className='rounded-full' height={30} width={30}/>
            )
        })}
    </div>
  )
}

export default TeamMembers