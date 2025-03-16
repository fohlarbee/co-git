"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import { AppSideBar } from "./app-sidebar";
import { Button } from "@/components/ui/button";
import { MenuIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
};
const SidebarLayout = ({ children }: Props) => {
    const [isOpen, setIsOpen] = React.useState(false);
  
  return (
    <SidebarProvider className="">
      <AppSideBar isOpen={isOpen} setIsOpen={setIsOpen}/>
      <main className="m-2 w-full">
        <div className="flex items-center gap-2 rounded-md border border-sidebar-border bg-sidebar p-2 px-4 shadow-lg">
          {/* <SearchBar/> */}
          <Button className="justify-start md:hidden" size='sm' variant={'ghost'}>
            <MenuIcon/>
          </Button>
          <div className="ml-auto">
             <UserButton />

          </div>
         
        </div>
        <div className="h-4"></div>
        {/* mainContent */}
        <div className={`h-[calc(100vh-6rem)] overflow-y-scroll rounded-md border border-sidebar-border bg-sidebar p-4 shadow-lg `}>
        {/* ${isOpen ? 'hidden' : ''} */}
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
};

export default SidebarLayout;
