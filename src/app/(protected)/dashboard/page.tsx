"use client";
import useProject from "@/hooks/use-project";
import { ExternalLinkIcon, GitCompare } from "lucide-react";
import Link from "next/link";
import React from "react";
import CommitLog from "./commit-log";
import AskQuestionCard from "./ask-question-card";
import MeetingCard from "./meeting-card";

const DashboardPage = () => {
  const { project } = useProject();

  return (
    <div>
      <div className="items-ceenter flex flex-wrap justify-between gap-y-4">
        {/* github link */}
        <div className="w-fit rounded-md bg-primary px-4 py-3">
          <div className="flex items-center">
            <GitCompare size={24} className="text-[#fff]" />
            <div className="ml-2">
              <p className="text-sm font-medium text-[#fff]">
                This project is linked to{" "}
                <Link
                  href={project?.githubUrl ?? ""}
                  className="inline-flex items-center text-white/80 hover:underline"
                >
                  {project?.githubUrl}
                  <ExternalLinkIcon size={16} className="ml-1" />
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="h-4"></div>

        <div className="flex items-center gap-4">
          TeamMembers InviteButton AchieveButton
        </div>
      </div>

      <div className="mt">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          <AskQuestionCard/>
          <MeetingCard/>
        </div>
      </div>

      <div className="mt-8"></div>
      <CommitLog />
    </div>
  );
};

export default DashboardPage;
