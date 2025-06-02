"use client"

import UserDiv from "@/components/organisms/userdiv"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { Home, FolderUp, ChartColumn } from "lucide-react"

import Link from "next/link"

export function AppSidebar() {
  const { state } = useSidebar();

  const items = [
    {
      title: "Home",
      url: "/",
      icon: Home,
    },
    {
      title: "Upload",
      url: "/upload",
      icon: FolderUp,
    },
    {
      title: "Statistics",
      url: "/stats",
      icon: ChartColumn,
    },
  ]

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="transition-all duration-300">
          <Link
            className={
              "text-3xl font-bold text-[var(--primary)] tracking-tighter " + (state === "collapsed" ? "p-1" : "p-2")
            }
            href="/"
          >
            {state === "collapsed" ? "V": "VAULT"}
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={"/dashboard/" + item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className={cn("transition-all duration-300", {
          "overflow-hidden": state === "collapsed"
        })}>
          <UserDiv />
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
