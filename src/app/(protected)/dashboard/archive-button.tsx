import { Button } from '@/components/ui/button';
import useProject from '@/hooks/use-project';
import { api } from '@/trpc/react'
import React from 'react'
import useRefresh from '@/hooks/use-refresh';
import { ArchiveIcon } from 'lucide-react';
import { toast } from 'sonner';

 const ArchiveButton = () => {
  const archiveProject = api.project.archiveProject.useMutation();
  const {projectId} = useProject();
  const refetch = useRefresh();
  return (
    <Button disabled={archiveProject.isPending} className='size-sm' variant={'destructive'} onClick={() => {
      const confirm = window.confirm('Are you sure you want to archive this project?');
      if (confirm) archiveProject.mutate({projectId}, {
        onSuccess: () => {
          toast.success('Project archived');
          refetch();
        },
        onError: () => toast.error('Failed to archive project')
      })
    }}>
      <ArchiveIcon className='size-6' />
    </Button>
  )
}

export default ArchiveButton