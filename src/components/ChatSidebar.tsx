import { useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  MessageSquare, 
  Settings, 
  CreditCard, 
  MoreHorizontal,
  Trash2,
  ChevronDown
} from 'lucide-react'
import { Chat, User } from '@/App'
import { cn } from '@/lib/utils'

interface ChatSidebarProps {
  chats: Chat[]
  currentChatId: string | null
  onChatSelect: (chatId: string) => void
  onNewChat: () => void
  onDeleteChat: (chatId: string) => void
  user: User
  onSettingsOpen: () => void
  onBillingOpen: () => void
}

export function ChatSidebar({
  chats,
  currentChatId,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  user,
  onSettingsOpen,
  onBillingOpen
}: ChatSidebarProps) {
  const [hoveredChat, setHoveredChat] = useState<string | null>(null)

  const formatChatTitle = (chat: Chat) => {
    if (chat.messages.length === 0) return 'New Chat'
    const firstMessage = chat.messages.find(m => m.role === 'user')
    return firstMessage?.content.slice(0, 50) + (firstMessage?.content.length > 50 ? '...' : '') || 'New Chat'
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  return (
    <Sidebar className="border-r border-border/40" collapsible="icon">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-purple-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg text-foreground">Claude</span>
          </div>
          <SidebarTrigger />
        </div>
        
        <Button 
          onClick={onNewChat}
          className="w-full mt-3 bg-primary hover:bg-primary/90 text-primary-foreground"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New chat
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <ScrollArea className="flex-1">
          <SidebarMenu className="p-2">
            {chats.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <div className="flex items-center w-full group">
                  <SidebarMenuButton
                    onClick={() => onChatSelect(chat.id)}
                    onMouseEnter={() => setHoveredChat(chat.id)}
                    onMouseLeave={() => setHoveredChat(null)}
                    className={cn(
                      "flex-1 justify-between group relative",
                      currentChatId === chat.id && "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {formatChatTitle(chat)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(chat.updatedAt)}
                      </div>
                    </div>
                  </SidebarMenuButton>
                  {(hoveredChat === chat.id || currentChatId === chat.id) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 ml-1 opacity-0 group-hover:opacity-100 focus:opacity-100 text-muted-foreground hover:text-foreground"
                          tabIndex={0}
                          onClick={e => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteChat(chat.id)
                          }}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete chat
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-start p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <Avatar className="w-8 h-8 mr-3">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="font-medium text-sm text-foreground">{user.name}</div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.plan === 'pro' || user.plan === 'max' ? 'default' : 'secondary'} className={cn(
                    "text-xs",
                    user.plan === 'pro' || user.plan === 'max' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {user.plan === 'pro' ? 'Pro plan' : user.plan === 'max' ? 'Max plan' : 'Free plan'}
                  </Badge>
                </div>
              </div>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onSettingsOpen}>
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onBillingOpen}>
              <CreditCard className="w-4 h-4 mr-2" />
              Billing
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}