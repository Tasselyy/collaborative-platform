"use client"

import * as React from "react"
import { ChevronsUpDown, Plus, Users, Briefcase, Building } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useTeams, Team } from "@/hooks/use-teams"
import { Skeleton } from "@/components/ui/skeleton"

// Function to get an icon based on the team name
function getTeamIcon(teamName: string): React.ElementType {
  // Simple logic to assign an icon based on the first letter of the team name
  const firstChar = teamName.charAt(0).toLowerCase()
  
  if (['a', 'b', 'c', 'd', 'e'].includes(firstChar)) return Building
  if (['f', 'g', 'h', 'i', 'j'].includes(firstChar)) return Briefcase
  return Users
}

export function TeamSwitcher() {
  const router = useRouter()
  const { isMobile } = useSidebar()
  const { teams, loading, error } = useTeams()
  const [activeTeam, setActiveTeam] = React.useState<Team | null>(null)

  // Set the first team as active when teams are loaded
  React.useEffect(() => {
    if (teams.length > 0 && !activeTeam) {
      setActiveTeam(teams[0])
    }
  }, [teams, activeTeam])

  const handleCreateTeam = () => {
    router.push("/teams/create")
  }

  // Show skeleton loader while teams are loading
  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="grid flex-1 gap-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // If there are no teams, show a button to create one
  if (teams.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" onClick={handleCreateTeam}>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Plus className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">Create Team</span>
              <span className="truncate text-xs">Get started</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!activeTeam) {
    return null
  }

  const TeamLogo = getTeamIcon(activeTeam.name)

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <TeamLogo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
                <span className="truncate text-xs capitalize">
                  {activeTeam.role.toLowerCase()}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Your Teams
            </DropdownMenuLabel>
            {teams.map((team, index) => {
              const IconComponent = getTeamIcon(team.name)
              return (
                <DropdownMenuItem
                  key={team.id}
                  onClick={() => setActiveTeam(team)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <IconComponent className="size-4 shrink-0" />
                  </div>
                  {team.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              )
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={handleCreateTeam}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Create team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}