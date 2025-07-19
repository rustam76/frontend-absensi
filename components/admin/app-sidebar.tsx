import { Calendar, Inbox, LogOut, User } from "lucide-react"


import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"




const items = [
  {
    title: "Departement",
    url: "/admin",
    icon: Calendar,
  },
  {
    title: "Employee",
    url: "/admin/employee",
    icon: Inbox,
  },
]

export function AppSidebar() {
//   const [showLogoutDialog, setShowLogoutDialog] = useState(false)


  return (
    <>
      <Sidebar collapsible="icon" className="border-r">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground text-2xl pl-3 font-bold mb-4">ABSENS</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center gap-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

      </Sidebar>

      
    </>
  )
}