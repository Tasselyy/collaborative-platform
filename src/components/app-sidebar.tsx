'use client';

import * as React from "react"
import { Table } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavTeams } from "@/components/nav-teams"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"

// Navigation data
const navMainItems = [
  {
    title: "Data Analysis",
    url: "#",
    icon: Table,
    isActive: true,
    items: [
      {
        title: "Dataset Table View",
        url: "/dashboard/dataTable",
      },
      {
        title: "Visualization",
        url: "/dashboard/visualization",
      },
      {
        title: "Upload",
        url: "/dashboard/upload",
      },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {data: session} = authClient.useSession();
  const user = { 
    name: session?.user.name || '',
    email: session?.user.email || '',
    avatar: session?.user.image || ''
  }
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavTeams />
        <NavMain items={navMainItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
