// import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";
import {api} from '@/trpc/react';

const useProject = () => {
  const { data: projects, error } = api.project.getProjects.useQuery();
  if ( error) console.log('Error fetching rojects', error);
  const [projectId, setProjectId] = useLocalStorage("co-git-projectId", "");
  const project = projects?.find((project) => project.id === projectId);

  return {
    projects,
    project,
    projectId,
    setProjectId,
  };
};

export default useProject;
