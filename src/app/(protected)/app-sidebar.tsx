"use client"

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Bot, CreditCard, LayoutDashboard, PresentationIcon } from "lucide-react"
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

const projects = [
    
    {
        name: 'Project 1',
    },
    {
        name: 'Project 2',
    },
    {
        name: 'Project 3',
    },
    {
        name: 'Project 4',
    }

]
export function AppSideBar(){
    const pathname = usePathname();


     return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarHeader>
                Logo
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
                                {projects.map((p, i) => (
                                    <SidebarMenuItem key={i}>
                                        <SidebarMenuButton asChild>

                                            <div>
                                                <div 
                                                className={cn(
                                                    'rounded-sm border size-6 flex items-center justify-center text-sm bg-[#fff] text-primary',
                                                    {
                                                        'bg-primary text-[#fff]': true 
                                                    }
                                                 )}>
                                                    {p.name[0]}

                                                </div>
                                                <span>{p.name}</span>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                        </SidebarMenu>
                    </SidebarGroupContent>

                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
     )
}