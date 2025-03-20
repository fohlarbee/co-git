"use client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import { AppSideBar, items } from "./app-sidebar";
import { Button } from "@/components/ui/button";
import { MenuIcon, PlusIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SheetContent, SheetHeader, SheetTitle, SheetTrigger, Sheet } from "@/components/ui/sheet";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { usePathname } from "next/navigation";
import useProject from "@/hooks/use-project";

type Props = {
  children: React.ReactNode;
};
const SidebarLayout = ({ children }: Props) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [layerOpen, setIsLayerOpen] = React.useState(false);
    const pathname = usePathname();
    const {project, projectId, projects, setProjectId} = useProject();
  
  

  
  return (
    <>
  

  <SidebarProvider className="">
      <AppSideBar isOpen={isOpen} setIsOpen={setIsOpen}/>
      <main className="m-2 w-full">
        <div className="flex items-center gap-2 rounded-md border border-sidebar-border bg-sidebar p-2 px-4 shadow-lg">
          {/* <SearchBar/> */}
          <Sheet>

            <SheetTrigger>
              <Button className="justify-start md:hidden" size='sm' variant={'ghost'} onClick={() => setIsLayerOpen(true)}>
                <MenuIcon/>
              </Button>
            </SheetTrigger>
            {
              layerOpen && (
                <SheetContent className="sm:max-w-[80vw]">
                          <SheetHeader>
                              <SheetTitle>
                                  <div className="flex items-center gap-2">
                                      <Image src="/images/up-left.png" alt="logo" width={40} height={50} />
                                        <h1 className="text-xl font-bold text-primary/80">Co-Git</h1>
                                   </div>
                              </SheetTitle>
                             
                              <Separator/>
                           </SheetHeader>
                           <div className="h-4"></div>
                            <h2 className="text-left text-black/50 leading-4 ">Application</h2>
                            <div className="h-4"></div>
                            <div className="flex flex-col justify-start gap-2 text-left items-start">

                              {items.map((item, index) => (
                                  <Button key={index} 
                                  className={cn('w-full justify-start', {
                                    'bg-primary text-[#fff]': pathname === item.url
                                  })}
                                    variant="ghost" onClick={() => setIsLayerOpen(false)}>
                                      <Link 
                                      className="list-none flex items-center gap-2"
                                      href={item.url}
                                      >
                                          <item.icon size={24} />
                                          <span>{item.title}</span>
                                      </Link>
                                  </Button>
                              ))}
                          </div>               
                              <div className="h-4 "></div>
                              <Separator/>                 
                              <h2 className="text-left text-black/50 leading-4 mt-3">Your Projects</h2>
                              <div className="flex flex-col justify-start gap-2 text-left items-start m-2">
                                  
                                {projects && (
                                      projects?.map((p, i) => (
                                        <Button key={i} onClick={() => setProjectId(p.id)} variant={'ghost'} className="w-full justify-start">
                                              <div
                                                className={cn(
                                                  "flex size-6 items-center justify-center rounded-sm border bg-[#fff] text-sm text-primary",
                                                  {
                                                    "bg-primary text-[#fff]": projectId === p.id,
                                                  },
                                                )}
                                              >
                                                {p.name[0]}
                                              </div>
                                              <span>{p.name}</span>
                                        </Button>
                                      ))
                                    )}
                              </div>
                                <Button size="sm" variant="outline" className="w-fit">
                                     <Link href="/create"
                                     className="flex items-center gap-2"
                                     >

                                      <PlusIcon />
                                      Create Project
                                    </Link>
                                </Button>
                </SheetContent>
              )
            }
          </Sheet>
          
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


    </>
    
  );
};

export default SidebarLayout;
