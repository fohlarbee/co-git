"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import useRefresh from '@/hooks/use-refresh';
import { api } from '@/trpc/react';
import Image from 'next/image';
import React from 'react'
import {useForm} from 'react-hook-form'
import { toast } from 'sonner';


type FormInput = {
    repoUrl: string;
    projectName: string;
    githubToken?: string;
    
}
const CreatePage = () => {
   
    const {register, handleSubmit, reset} = useForm<FormInput>();
    const createProject = api.project.createProject.useMutation();
    const refetch =  useRefresh();

    const onSubmit = async (data: FormInput) => {
        window.alert(JSON.stringify(data));
        createProject.mutate({
            projectName: data.projectName,
            githubUrl: data.repoUrl,
            githubToken: data.githubToken
        }, {
            onSuccess: () => {
                toast.success('Project Created Successfully');
                void refetch();
                reset();
            },
            onError: (error) => {
                toast.error('Failed to create project');
            }
        })
        return true;
        // console.log(data);
        // reset();
    }
  return (
    <div className='flex items-center gap-12 h-full justify-center'>
        <Image src='/images/create.png' 
        width={400} height={400} alt='create' className='h-56 w-auto'/>
        <div>
            <div >
                <h1 className='font-semibold text-4xl'>
                    Link your Github Repository
                </h1>
                <p className='text-sm text-muted-foreground text-center mt-2'>
                    Enter the URL of your repository to link to Co-Git
                </p>
            </div>
            <div className="h-4"></div>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input 
                    {...register('projectName' , {required: true})}
                    placeholder='Project Name'
                    required
                    />
                    <div className="h-2"></div>
                    <Input 
                    {...register('repoUrl' , {required: true})}
                    placeholder='Github URL'
                    type='url'
                    required
                    />
                    <div className="h-2"></div>
                    <Input 
                    {...register('githubToken')}
                    placeholder='Github Token (Optional)'
                    />
                    <div className="h-4"></div>
                    <Button type='submit' className='w-full' disabled={createProject.isPending}>
                        Create Project
                    </Button>


                </form>
            </div>
        </div>
    </div>
  )
}

export default CreatePage;