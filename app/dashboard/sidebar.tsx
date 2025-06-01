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
} from "@/components/ui/sidebar"
import { Home, FolderUp, ChartColumn } from "lucide-react"

import Link from "next/link"

export function AppSidebar() {
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
        <div>
          <Link
            className="p-2 text-3xl font-bold text-[var(--primary)] tracking-tighter"
            href="/"
          >
            VAULT
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
                    <a href={"/dashboard/"+ item.url}>
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
        <UserDiv />
      </SidebarFooter>
    </Sidebar>
  )
}
