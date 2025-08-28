'use client'

import { useState, useEffect } from 'react'
import { useAuth, ProtectedRoute } from '@/lib/simple-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  MessageSquare, 
  Search, 
  Send, 
  Paperclip, 
  Image,
  File,
  Phone,
  Video,
  MoreHorizontal,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  ShoppingCart,
  Package,
  Star
} from 'lucide-react'

interface Message {
  id: string
  content: string
  senderId: string
  senderName: string
  timestamp: string
  type: 'text' | 'image' | 'file'
  attachments?: string[]
}

interface Chat {
  id: string
  rfqTitle: string
  counterpartyName: string
  counterpartyRole: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  status: 'active' | 'closed'
  counterpartyRating?: number
}

function ChatContent() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [message, setMessage] = useState('')
  const [chats, setChats] = useState<Chat[]>([])
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    // Mock data - in real app, fetch from API
    setChats([
      {
        id: '1',
        rfqTitle: 'Steel Pipes for Construction',
        counterpartyName: 'Steel Industries Ltd',
        counterpartyRole: 'SELLER',
        lastMessage: 'Thank you for your interest. We can provide high-quality steel pipes at competitive rates.',
        lastMessageTime: '2 hours ago',
        unreadCount: 2,
        status: 'active',
        counterpartyRating: 4.5
      },
      {
        id: '2',
        rfqTitle: 'Electrical Components',
        counterpartyName: 'Tech Suppliers',
        counterpartyRole: 'SELLER',
        lastMessage: 'Can you provide more details about the specifications you need?',
        lastMessageTime: '1 day ago',
        unreadCount: 0,
        status: 'active',
        counterpartyRating: 4.2
      },
      {
        id: '3',
        rfqTitle: 'Cement Supply Required',
        counterpartyName: 'Construction Co.',
        counterpartyRole: 'BUYER',
        lastMessage: 'We need bulk cement supply for our upcoming project.',
        lastMessageTime: '3 days ago',
        unreadCount: 1,
        status: 'active',
        counterpartyRating: 4.7
      },
      {
        id: '4',
        rfqTitle: 'Industrial Machinery Parts',
        counterpartyName: 'Factory Corp',
        counterpartyRole: 'BUYER',
        lastMessage: 'Deal completed successfully. Thank you!',
        lastMessageTime: '1 week ago',
        unreadCount: 0,
        status: 'closed',
        counterpartyRating: 4.8
      }
    ])

    // Mock messages for selected chat
    setMessages([
      {
        id: '1',
        content: 'Hello, I\'m interested in your steel pipes for our construction project.',
        senderId: 'buyer-1',
        senderName: 'Construction Co.',
        timestamp: '2024-01-20 10:30',
        type: 'text'
      },
      {
        id: '2',
        content: 'Thank you for your interest. We can provide high-quality steel pipes at competitive rates.',
        senderId: 'seller-1',
        senderName: 'Steel Industries Ltd',
        timestamp: '2024-01-20 11:15',
        type: 'text'
      },
      {
        id: '3',
        content: 'What are your bulk pricing options for 100+ pieces?',
        senderId: 'buyer-1',
        senderName: 'Construction Co.',
        timestamp: '2024-01-20 11:30',
        type: 'text'
      },
      {
        id: '4',
        content: 'For 100+ pieces, we can offer Rs. 45,000 per piece with a 5% discount.',
        senderId: 'seller-1',
        senderName: 'Steel Industries Ltd',
        timestamp: '2024-01-20 12:00',
        type: 'text'
      }
    ])
  }, [])

  const filteredChats = chats.filter(chat =>
    chat.rfqTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.counterpartyName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSendMessage = () => {
    if (message.trim() === '') return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      senderId: user.id,
      senderName: user.name,
      timestamp: new Date().toLocaleString(),
      type: 'text'
    }

    setMessages([...messages, newMessage])
    setMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const selectedChatData = chats.find(chat => chat.id === selectedChat)

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Chat List */}
      <div className="w-80 border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChat === chat.id ? 'bg-blue-50 border-blue-200' : ''
              }`}
              onClick={() => setSelectedChat(chat.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-sm">{chat.rfqTitle}</h3>
                    {chat.status === 'active' && (
                      <Badge className="bg-green-100 text-green-800 text-xs">Active</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{chat.counterpartyName}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {chat.counterpartyRole}
                    </Badge>
                    {chat.counterpartyRating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs">{chat.counterpartyRating}</span>
                      </div>
                    )}
                  </div>
                </div>
                {chat.unreadCount > 0 && (
                  <Badge className="bg-red-500 text-white text-xs">
                    {chat.unreadCount}
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-600 truncate mb-1">
                {chat.lastMessage}
              </p>
              <p className="text-xs text-gray-500">{chat.lastMessageTime}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChatData ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-semibold">{selectedChatData.rfqTitle}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedChatData.counterpartyName} • {selectedChatData.counterpartyRole}
                  </p>
                </div>
                {selectedChatData.counterpartyRating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{selectedChatData.counterpartyRating}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Video className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => {
                const isOwnMessage = msg.senderId === user.id
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      {!isOwnMessage && (
                        <div className="text-xs font-medium mb-1">{msg.senderName}</div>
                      )}
                      <div className="text-sm">{msg.content}</div>
                      <div className="text-xs mt-1 opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Image className="h-4 w-4" alt="Attach image" />
                </Button>
                <div className="flex-1">
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full"
                  />
                </div>
                <Button onClick={handleSendMessage} disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-600">Choose a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with buyers and sellers</p>
        </div>
        <ChatContent />
      </div>
    </ProtectedRoute>
  )
}