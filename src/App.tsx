import { useState, useEffect } from 'react'
import { SidebarProvider } from '@/components/ui/sidebar'
import { ChatSidebar } from '@/components/ChatSidebar'
import { ChatInterface } from '@/components/ChatInterface'
import { SettingsDialog } from '@/components/SettingsDialog'
import { BillingDialog } from '@/components/BillingDialog'

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export interface User {
  name: string
  email: string
  plan: 'free' | 'pro' | 'max'
  avatar?: string
}

function App() {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [billingOpen, setBillingOpen] = useState(false)
  const [user, setUser] = useState<User>({
    name: 'Kai Feng',
    email: 'kai@example.com',
    plan: 'pro'
  })

  // Load chats from localStorage on mount
  useEffect(() => {
    const savedChats = localStorage.getItem('ai-chat-history')
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats).map((chat: Chat & { createdAt: string; updatedAt: string; messages: Array<Message & { timestamp: string }> }) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        updatedAt: new Date(chat.updatedAt),
        messages: chat.messages.map((msg: Message & { timestamp: string }) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }))
      setChats(parsedChats)
      if (parsedChats.length > 0) {
        setCurrentChatId(parsedChats[0].id)
      }
    }
  }, [])

  // Save chats to localStorage whenever chats change
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem('ai-chat-history', JSON.stringify(chats))
    }
  }, [chats])

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    setChats(prev => [newChat, ...prev])
    setCurrentChatId(newChat.id)
  }

  const updateChat = (chatId: string, updates: Partial<Chat>) => {
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, ...updates, updatedAt: new Date() }
        : chat
    ))
  }

  const deleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId))
    if (currentChatId === chatId) {
      const remainingChats = chats.filter(chat => chat.id !== chatId)
      setCurrentChatId(remainingChats.length > 0 ? remainingChats[0].id : null)
    }
  }

  const currentChat = chats.find(chat => chat.id === currentChatId)

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <ChatSidebar
          chats={chats}
          currentChatId={currentChatId}
          onChatSelect={setCurrentChatId}
          onNewChat={createNewChat}
          onDeleteChat={deleteChat}
          user={user}
          onSettingsOpen={() => setSettingsOpen(true)}
          onBillingOpen={() => setBillingOpen(true)}
        />
        
        <ChatInterface
          chat={currentChat}
          onUpdateChat={updateChat}
          onNewChat={createNewChat}
          user={user}
        />

        <SettingsDialog
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
          user={user}
          onUserUpdate={setUser}
        />

        <BillingDialog
          open={billingOpen}
          onOpenChange={setBillingOpen}
          user={user}
          onUserUpdate={setUser}
        />
      </div>
    </SidebarProvider>
  )
}

export default App