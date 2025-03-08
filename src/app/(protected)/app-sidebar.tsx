"use client"

import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import useProject from "@/hooks/use-project"
import { cn } from "@/lib/utils"
import { Bot, CreditCard, LayoutDashboard, Plus, PresentationIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const items = [
     {
        title: 'Dashboard',
        url:"/dashboard",
        icon:LayoutDashboard
     },
     {
        title: 'Q&A',
        url:"/qa",
        icon:Bot
     },
     {
        title: 'Meetings',
        url:"/meetings",
        icon:PresentationIcon
     },
     {
        title: 'Billings',
        url:"/billings",
        icon:CreditCard
     },
];


export function AppSideBar(){
    const pathname = usePathname();
    const {open} = useSidebar();
    const {setProjectId, projectId, projects} = useProject();


     return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                <div className="items-center flex gap-2" >
                    <Image src='/images/up-left.png' alt='logo' width={40} height={50}/>
                    {open && (
                    <h1 className="text-xl font-bold text-primary/80">Co-Git</h1>

                    )}
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Application
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item, index) => (
                                
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild>
                                        <Link 
                                        className={cn([
                                            pathname === item.url ? 'bg-primary text-[#fff]' : '',
                                            'list-none'
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
                    <SidebarGroupLabel>
                        Your Projects
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                                {projects?.map((p, i) => (
                                    <SidebarMenuItem key={i}>
                                        <SidebarMenuButton asChild>

                                            <div onClick={() => setProjectId(p.id)}>
                                                <div 
                                                className={cn(
                                                    'rounded-sm border size-6 flex items-center justify-center text-sm bg-[#fff] text-primary',
                                                    {
                                                        'bg-primary text-[#fff]': projectId === p.id 
                                                    }
                                                 )}>
                                                    {p.name[0]}

                                                </div>
                                                <span>{p.name}</span>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                                 <div className="h-2"></div>
                                 {open && (
                                         <SidebarMenuItem>
                                         <Link href='/create'>
                                             <Button size='sm' variant='outline' className="w-fit">
                                                 <Plus/>
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
     )
}