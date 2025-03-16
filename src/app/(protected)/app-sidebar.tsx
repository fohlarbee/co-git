"use client";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import useProject from "@/hooks/use-project";
import { cn } from "@/lib/utils";
import {
  Bot,
  CreditCard,
  LayoutDashboard,
  Loader2,
  MenuIcon,
  Plus,
  PresentationIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Q&A",
    url: "/qa",
    icon: Bot,
  },
  {
    title: "Meetings",
    url: "/meetings",
    icon: PresentationIcon,
  },
  {
    title: "Billings",
    url: "/billings",
    icon: CreditCard,
  },
];

export function AppSideBar({isOpen, setIsOpen}: {isOpen:boolean, setIsOpen:(open: boolean) => void}) {
  const pathname = usePathname();
  const { open } = useSidebar();
  const { setProjectId, projectId, projects } = useProject();
  // const [isOpen, setIsOpen] = React.useState(false);

  return (

    <>

      {/* <Button
          variant="ghost"
          className="fixed top-4 left-4 z-5 md:hidden "
          
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </Button> */}
      <Sidebar
      
        // className={cn(
        //   "fixed inset-y-0 left-0 z-500 w-64 bg-white shadow-lg transition-transform md:relative md:translate-x-0",
        //   isOpen ? "translate-x-0 w-full z-500" : "-translate-x-full"
        // )}
      
      collapsible="icon" variant="floating" >
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Image src="/images/up-left.png" alt="logo" width={40} height={50} />
            {open && (
              <h1 className="text-xl font-bold text-primary/80">Co-Git</h1>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <Link
                        className={cn([
                          pathname === item.url ? "bg-primary text-[#fff]" : "",
                          "list-none",
                        ])}
                        href={item.url}
                      >
                        <item.icon size={24} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Your Projects</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {projects ? (
                  projects?.map((p, i) => (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuButton asChild>
                        <div onClick={() => setProjectId(p.id)}>
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
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))
                ) : (
                  <SidebarMenuItem>
                    <div className="flex h-20 w-full flex-col items-center justify-center">
                      <Loader2 className="size-6 animate-spin text-primary" />
                      <p className="text-sm text-primary">Loading projects</p>
                    </div>
                  </SidebarMenuItem>
                )}

                <div className="h-2"></div>
                {open && (
                  <SidebarMenuItem>
                    <Link href="/create">
                      <Button size="sm" variant="outline" className="w-fit">
                        <Plus />
                        Create Project
                      </Button>
                    </Link>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

       {/* Overlay for Small Screens */}
       {/* {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )} */}


    </>
   
  );
}
