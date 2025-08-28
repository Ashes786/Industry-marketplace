'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  Smile,
  MoreVertical,
  Phone,
  Video,
  Clock,
  CheckCircle,
  AlertTriangle,
  Package,
  DollarSign,
  FileText,
  Eye,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'

interface ChatPageProps {
  user: any
}

interface Message {
  id: string
  rfqId: string
  senderId: string
  receiverId: string
  message: string
  attachments?: string
  messageType: string
  timestamp: string
  isRead: boolean
  sender: {
    id: string
    name: string
    email: string
    companyName?: string
  }
  receiver: {
    id: string
    name: string
    email: string
    companyName?: string
  }
}

interface RFQ {
  id: string
  title: string
  description: string
  category: string
  budget?: number
  quantity: number
  unit: string
  deadline?: string
  status: string
  buyer: {
    id: string
    name: string
    email: string
    companyName?: string
  }
}

export default function ChatPage({ user }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [rfqs, setRfqs] = useState<RFQ[]>([])
  const [selectedRFQ, setSelectedRFQ] = useState<RFQ | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    fetchRFQs()
  }, [])

  useEffect(() => {
    if (selectedRFQ) {
      fetchMessages(selectedRFQ.id)
    }
  }, [selectedRFQ])

  const fetchRFQs = async () => {
    try {
      const response = await fetch('/api/rfqs')
      if (response.ok) {
        const data = await response.json()
        setRfqs(data)
        if (data.length > 0 && !selectedRFQ) {
          setSelectedRFQ(data[0])
        }
      }
    } catch (error) {
      console.error('Error fetching RFQs:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (rfqId: string) => {
    try {
      const response = await fetch(`/api/rfqs/${rfqId}/messages`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedRFQ) return

    setSending(true)
    try {
      const response = await fetch(`/api/rfqs/${selectedRFQ.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage,
          messageType: 'text'
        }),
      })

      if (response.ok) {
        setNewMessage('')
        fetchMessages(selectedRFQ.id)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800'
      case 'NEGOTIATION': return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'CLOSED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">Messages</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
          {/* RFQ List */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Active Conversations</CardTitle>
                <CardDescription>Select an RFQ to view messages</CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto">
                {rfqs.map((rfq) => (
                  <div
                    key={rfq.id}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedRFQ?.id === rfq.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                    }`}
                    onClick={() => setSelectedRFQ(rfq)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm line-clamp-1">{rfq.title}</h4>
                      <Badge className={getStatusColor(rfq.status)}>{rfq.status}</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{rfq.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{rfq.category}</span>
                      <span>{new Date(rfq.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                {rfqs.length === 0 && (
                  <div className="p-8 text-center">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No active conversations</p>
                    <Link href="/dashboard/rfqs/create" className="text-blue-600 hover:underline">
                      Create your first RFQ
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col">
              {selectedRFQ ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="pb-3 border-b">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{selectedRFQ.title}</CardTitle>
                        <CardDescription>
                          {selectedRFQ.category} • {selectedRFQ.quantity} {selectedRFQ.unit}
                          {selectedRFQ.budget && ` • Budget: Rs. ${selectedRFQ.budget.toLocaleString()}`}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(selectedRFQ.status)}>
                          {selectedRFQ.status}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages Area */}
                  <CardContent className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {messages.map((message) => {
                        const isCurrentUser = message.senderId === user.id
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                isCurrentUser
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white border'
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                {!isCurrentUser && (
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback>
                                      {message.sender.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                )}
                                <span className="text-xs opacity-75">
                                  {isCurrentUser ? 'You' : message.sender.name}
                                </span>
                              </div>
                              <p className="text-sm">{message.message}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs opacity-50">
                                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {isCurrentUser && (
                                  <CheckCircle className="h-3 w-3 opacity-75" />
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      {messages.length === 0 && (
                        <div className="text-center py-8">
                          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No messages yet. Start the conversation!</p>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  {/* Message Input */}
                  <div className="p-4 border-t">
                    <form onSubmit={sendMessage} className="flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                      />
                      <Button type="button" size="sm" variant="outline">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Button type="submit" size="sm" disabled={sending || !newMessage.trim()}>
                        {sending ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose an RFQ from the list to view messages</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}