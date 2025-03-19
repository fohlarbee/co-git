 "use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRefresh from "@/hooks/use-refresh";
import { api } from "@/trpc/react";
import { InfoIcon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken?: string;
};
const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.project.createProject.useMutation();
  const checkCredits = api.project.checkCredits.useMutation();
  const refetch = useRefresh();

  const onSubmit = async (data: FormInput) => {
    if (!!checkCredits.data){
       
      createProject.mutate(
        {
          projectName: data.projectName,
          githubUrl: data.repoUrl,
          githubToken: data.githubToken,
        },
        {
          onSuccess: () => {
            toast.success("Project Created Successfully");
            void refetch();
            reset();
          },
          onError: (error) => {
            toast.error("Failed to create project");
          },
        },
      );
    }else{
      checkCredits.mutate({
        githubUrl: data.repoUrl,
        githubToken: data.githubToken
      });
    }
    return true;
    // console.log(data);
    // reset();
  };

  const hasEnoughCredits = checkCredits?.data?.userCredits ? checkCredits?.data?.userCredits >= checkCredits?.data?.fileCount : true;
  return (
    <div className="flex h-full items-center justify-center gap-12">
      <Image
        src="/images/create.png"
        width={400}
        height={400}
        alt="create"
        className="h-56 w-auto"
      />
      <div>
        <div>
          <h1 className="text-4xl font-semibold text-center">
            Link your Github Repository
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Enter the URL of your repository to link to Co-Git
          </p>
        </div>
        <div className="h-4"></div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("projectName", { required: true })}
              placeholder="Project Name"
              required
            />
            <div className="h-2"></div>
            <Input
              {...register("repoUrl", { required: true })}
              placeholder="Github URL"
              type="url"
              required
            />
            <div className="h-2"></div>
            <Input
              {...register("githubToken")}
              placeholder="Github Token (Optional)"
            />
            <div className="h-4"></div>
            {!!checkCredits.data && (
              <>
                <div className="bg-green-50 px-4 py-2 rounded-md border border-green-200 text-orange-700 mb-3">
                    <div className="flex items-center gap-2">
                      <InfoIcon className='size-4'/>
                      <p className=' text-sm'>You are meant to be charged <strong>{checkCredits.data?.fileCount}</strong> {" "}credits for this repository.
                        But since Co-git is in beta and also minimizing the number of api calls--just 10 files will be indexed, therefore 10 credits will be deducted from your account.
                      </p>
                    </div>
                    <p className='text-xs ml-6 text-green-700'>You have <strong>{checkCredits.data?.userCredits}</strong> {" "}credits remaining</p>

                 </div>
              </>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={createProject.isPending || checkCredits.isPending || !hasEnoughCredits}
            >
              {!!checkCredits.data ? "Create Project" : "Check Credits"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;

