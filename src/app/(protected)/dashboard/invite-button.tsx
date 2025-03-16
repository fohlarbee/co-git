

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import useProject from '@/hooks/use-project'
import { SendIcon } from 'lucide-react'
import React from 'react'
import { toast,  } from 'sonner'

const InviteButton = () => {
    const [open, setOpen] = React.useState(false);
    const {projectId} = useProject();
  return (
    <>

        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Invite Team Members
                    </DialogTitle>
                </DialogHeader>
                <p className='text-sm text-gray-500'>
                    Copy and share the link below to invite team members to this project
                </p>
                <Input
                    className='mt-4'
                    readOnly
                    onClick={() => {
                        navigator.clipboard.writeText(`${window.location.origin}/join/${projectId}`)
                        toast.success('Link copied to clipboard');

                    }}
                    value={`${window.location.origin}/join/${projectId}`}
                />
            </DialogContent>
        </Dialog>

        <Button onClick={() => setOpen(true)} variant={'ghost'} className='size-sm'>
            <SendIcon className='size-6'/>
        </Button>
    </>
  )
}

export default InviteButton