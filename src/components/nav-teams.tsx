"use client"

import * as React from "react"
import { ChevronRight, Users, Building, Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useTeams } from "@/hooks/use-teams"
import { Skeleton } from "@/components/ui/skeleton"

// Function to get an icon based on the team name
function getTeamIcon(teamName: string): React.ElementType {
  const firstChar = teamName.charAt(0).toLowerCase()
  
  if (['a', 'b', 'c', 'd', 'e'].includes(firstChar)) return Building
  if (['f', 'g', 'h', 'i', 'j'].includes(firstChar)) return Briefcase
  return Users
}

export function NavTeams() {
  const router = useRouter()
  const { teams, loading, error } = useTeams()
  
  if (loading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Teams</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Skeleton className="h-4 w-4 mr-2" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  // If there are no teams, show a button to create one
  if (teams.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>Teams</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push("/teams/create")}>
              <Users className="mr-2" />
              <span>Create a Team</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    )
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Teams</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible
          asChild
          defaultOpen={true}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip="Your Teams" className="cursor-pointer">
                <Users />
                <span>Your Teams</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {teams.map((team) => {
                  const TeamIcon = getTeamIcon(team.name)
                  return (
                    <SidebarMenuSubItem key={team.id}>
                      <SidebarMenuSubButton
                        onClick={() => router.push(`/teams/${team.id}`)}
                        className="cursor-pointer"
                      >
                        <TeamIcon className="mr-2 h-4 w-4" />
                        <span>{team.name}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )
                })}
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    onClick={() => router.push("/teams/create")}
                    className="text-muted-foreground cursor-pointer"
                  >
                    <span>+ Create new team</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  )
}