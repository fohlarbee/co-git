"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import React from 'react'
import {useForm} from 'react-hook-form'


type FormInput = {
    repoUrl: string;
    projectName: string;
    githubToken?: string;
    
}
const CreatePage = () => {
   
    const {register, handleSubmit, reset} = useForm<FormInput>();

    const onSubmit = async (data: FormInput) => {
        window.alert(JSON.stringify(data));
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
                    <Button type='submit' className='w-full'>
                        Create Project
                    </Button>


                </form>
            </div>
        </div>
    </div>
  )
}

export default CreatePage;