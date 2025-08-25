'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Send, Paperclip, Phone, Mail, CheckCircle, Clock } from 'lucide-react'
import { io, Socket } from 'socket.io-client'

interface ChatMessage {
  id: string
  rfqId: string
  senderId: string
  receiverId: string
  messageText?: string
  attachments?: string[]
  timestamp: string
  sender: {
    id: string
    name: string
  }
  receiver: {
    id: string
    name: string
  }
}

interface RFQDetails {
  id: string
  title: string
  description: string
  quantity: number
  unit: string
  budget?: number
  status: string
  buyer: {
    id: string
    name: string
    email: string
  }
  seller?: {
    id: string
    name: string
    email: string
  }
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const rfqId = searchParams.get('rfqId')
  
  const [socket, setSocket] = useState<Socket | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [rfqDetails, setRfqDetails] = useState<RFQDetails | null>(null)
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (!rfqId || !session) {
      return
    }

    // Initialize socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001')
    setSocket(newSocket)

    // Join RFQ room
    newSocket.emit('join_rfq_room', {
      rfqId,
      userId: session.user.id
    })

    // Socket event listeners
    newSocket.on('chat_history', (history: ChatMessage[]) => {
      setMessages(history)
      setLoading(false)
    })

    newSocket.on('new_message', (newMessage: ChatMessage) => {
      setMessages(prev => [...prev, newMessage])
      setOtherUserTyping(false)
    })

    newSocket.on('user_typing', (data: { userId: string }) => {
      if (data.userId !== session.user.id) {
        setOtherUserTyping(true)
      }
    })

    newSocket.on('user_stopped_typing', (data: { userId: string }) => {
      if (data.userId !== session.user.id) {
        setOtherUserTyping(false)
      }
    })

    newSocket.on('error', (error: { message: string }) => {
      console.error('Socket error:', error.message)
    })

    // Fetch RFQ details
    fetchRFQDetails()

    return () => {
      newSocket.disconnect()
    }
  }, [rfqId, session, status, router])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchRFQDetails = async () => {
    try {
      const response = await fetch(`/api/rfqs/${rfqId}`)
      if (response.ok) {
        const data = await response.json()
        setRfqDetails(data)
      }
    } catch (error) {
      console.error('Error fetching RFQ details:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = () => {
    if (!message.trim() || !socket || !rfqDetails || !session) return

    const receiverId = session.user.id === rfqDetails.buyer.id 
      ? rfqDetails.seller?.id 
      : rfqDetails.buyer.id

    if (!receiverId) return

    socket.emit('send_message', {
      rfqId,
      senderId: session.user.id,
      receiverId,
      messageText: message,
      timestamp: new Date()
    })

    setMessage('')
    setIsTyping(false)
  }

  const handleTyping = () => {
    if (!isTyping && socket && rfqDetails && session) {
      setIsTyping(true)
      socket.emit('typing', { rfqId, userId: session.user.id })
      
      setTimeout(() => {
        setIsTyping(false)
        socket?.emit('stop_typing', { rfqId, userId: session.user.id })
      }, 1000)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !socket || !rfqDetails || !session) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer
      const buffer = Buffer.from(arrayBuffer)

      const receiverId = session.user.id === rfqDetails.buyer.id 
        ? rfqDetails.seller?.id 
        : rfqDetails.buyer.id

      if (receiverId) {
        socket.emit('upload_file', {
          rfqId,
          senderId: session.user.id,
          receiverId,
          file: buffer,
          fileName: file.name,
          fileType: file.type
        })
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Badge className="bg-blue-100 text-blue-800">Open</Badge>
      case 'IN_NEGOTIATION':
        return <Badge className="bg-yellow-100 text-yellow-800">In Negotiation</Badge>
      case 'APPROVED':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case 'CLOSED':
        return <Badge className="bg-gray-100 text-gray-800">Closed</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>
    }
  }

  if (loading || !rfqDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const otherUser = session.user.id === rfqDetails.buyer.id ? rfqDetails.seller : rfqDetails.buyer

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-900">{rfqDetails.title}</h1>
              <p className="text-sm text-gray-500">RFQ #{rfqId.slice(-6)}</p>
            </div>
            {getStatusBadge(rfqDetails.status)}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* RFQ Details Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">RFQ Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-gray-500">Description</h4>
                  <p className="text-sm mt-1">{rfqDetails.description}</p>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm text-gray-500">Quantity</h4>
                    <p className="text-sm font-medium">{rfqDetails.quantity} {rfqDetails.unit}</p>
                  </div>
                  {rfqDetails.budget && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-500">Budget</h4>
                      <p className="text-sm font-medium">Rs. {rfqDetails.budget.toLocaleString()}</p>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium text-sm text-gray-500 mb-3">Participants</h4>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {rfqDetails.buyer.name?.charAt(0) || 'B'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{rfqDetails.buyer.name}</p>
                        <p className="text-xs text-gray-500">Buyer</p>
                      </div>
                      {session.user.id === rfqDetails.buyer.id && (
                        <Badge className="bg-blue-100 text-blue-800">You</Badge>
                      )}
                    </div>

                    {rfqDetails.seller && (
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            {rfqDetails.seller.name?.charAt(0) || 'S'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{rfqDetails.seller.name}</p>
                          <p className="text-xs text-gray-500">Seller</p>
                        </div>
                        {session.user.id === rfqDetails.seller.id && (
                          <Badge className="bg-green-100 text-green-800">You</Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Phone className="w-4 h-4 mr-2" />
                    Call {otherUser?.name}
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Mail className="w-4 h-4 mr-2" />
                    Email {otherUser?.name}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback>
                        {otherUser?.name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{otherUser?.name}</CardTitle>
                      <CardDescription>
                        {otherUserTyping ? 'Typing...' : 'Online'}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => {
                    const isOwnMessage = msg.senderId === session?.user.id
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
                          {msg.messageText && (
                            <p className="text-sm">{msg.messageText}</p>
                          )}
                          {msg.attachments && (
                            <div className="mt-2">
                              <p className="text-xs opacity-75 mb-1">📎 Attachment</p>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs underline"
                              >
                                View File
                              </Button>
                            </div>
                          )}
                          <p className="text-xs opacity-75 mt-1">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept="image/*,.pdf,.doc,.docx"
                    />
                    <label htmlFor="file-upload">
                      <Button variant="ghost" size="sm" className="cursor-pointer">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                    </label>
                    
                    <Input
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value)
                        handleTyping()
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage()
                        }
                      }}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      size="sm"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}