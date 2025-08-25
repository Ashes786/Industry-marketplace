'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  MessageSquare, 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical,
  Phone,
  Video,
  Info,
  Check,
  CheckCheck
} from 'lucide-react'
import { io, Socket } from 'socket.io-client'

interface ChatMessage {
  id: string
  rfqId: string
  senderId: string
  receiverId: string
  message: string
  attachments?: string[]
  messageType?: string
  timestamp: Date
  isRead: boolean
}

interface ChatInterfaceProps {
  rfqId: string
  rfqTitle: string
  currentUserId: string
  otherUserId: string
  otherUserName: string
  otherUserAvatar?: string
  isOpen: boolean
  onClose: () => void
}

export default function ChatInterface({
  rfqId,
  rfqTitle,
  currentUserId,
  otherUserId,
  otherUserName,
  otherUserAvatar,
  isOpen,
  onClose
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Initialize socket connection
      const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
        transports: ['websocket', 'polling']
      })

      socketInstance.on('connect', () => {
        setIsConnected(true)
        console.log('Connected to chat server')
        
        // Join RFQ room
        socketInstance.emit('join_rfq_room', {
          rfqId,
          userId: currentUserId
        })

        // Get chat history
        socketInstance.emit('get_chat_history', {
          rfqId,
          userId: currentUserId
        })
      })

      socketInstance.on('disconnect', () => {
        setIsConnected(false)
        console.log('Disconnected from chat server')
      })

      // Listen for new messages
      socketInstance.on('new_message', (message: ChatMessage) => {
        setMessages(prev => [...prev, message])
        
        // Mark message as read if it's from the other user
        if (message.senderId !== currentUserId) {
          socketInstance.emit('mark_messages_read', {
            rfqId,
            userId: currentUserId,
            senderId: message.senderId
          })
        }
      })

      // Listen for chat history
      socketInstance.on('chat_history', (data: { rfqId: string; messages: ChatMessage[] }) => {
        if (data.rfqId === rfqId) {
          setMessages(data.messages)
        }
      })

      // Listen for typing indicators
      socketInstance.on('user_typing', (data: { userId: string; isTyping: boolean }) => {
        if (data.userId === otherUserId) {
          setIsTyping(data.isTyping)
        }
      })

      // Listen for read receipts
      socketInstance.on('messages_read', (data: { rfqId: string; userId: string; senderId: string }) => {
        if (data.rfqId === rfqId && data.senderId === currentUserId) {
          setMessages(prev => prev.map(msg => 
            msg.senderId === currentUserId && msg.receiverId === data.userId
              ? { ...msg, isRead: true }
              : msg
          ))
        }
      })

      setSocket(socketInstance)

      return () => {
        socketInstance.disconnect()
      }
    }
  }, [isOpen, rfqId, currentUserId, otherUserId])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() && socket) {
      socket.emit('send_message', {
        rfqId,
        senderId: currentUserId,
        receiverId: otherUserId,
        message: newMessage.trim(),
        messageType: 'text'
      })
      
      // Add message to local state immediately for better UX
      const tempMessage: ChatMessage = {
        id: `temp_${Date.now()}`,
        rfqId,
        senderId: currentUserId,
        receiverId: otherUserId,
        message: newMessage.trim(),
        timestamp: new Date(),
        isRead: false
      }
      
      setMessages(prev => [...prev, tempMessage])
      setNewMessage('')
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && socket) {
      // In a real implementation, you would upload the file first
      // For now, we'll simulate the upload
      const fileType = file.type.startsWith('image/') ? 'image' : 
                     file.type === 'application/pdf' ? 'pdf' : 'file'
      
      socket.emit('upload_file', {
        rfqId,
        senderId: currentUserId,
        receiverId: otherUserId,
        fileData: file, // In real implementation, this would be the uploaded file data
        fileName: file.name,
        fileType
      })
    }
  }

  const handleTyping = (isTyping: boolean) => {
    if (socket) {
      socket.emit('typing', {
        rfqId,
        userId: currentUserId,
        isTyping
      })
    }
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const messageDate = new Date(date)
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today'
    }
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday'
    }
    
    return messageDate.toLocaleDateString()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={otherUserAvatar} />
                <AvatarFallback>{otherUserName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{otherUserName}</CardTitle>
                <p className="text-sm text-gray-500">{rfqTitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Info className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message, index) => {
                const isCurrentUser = message.senderId === currentUserId
                const showDateHeader = index === 0 || 
                  formatDate(message.timestamp) !== formatDate(messages[index - 1].timestamp)
                
                return (
                  <div key={message.id}>
                    {showDateHeader && (
                      <div className="text-center text-sm text-gray-500 my-4">
                        {formatDate(message.timestamp)}
                      </div>
                    )}
                    
                    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                        <div className={`rounded-lg px-3 py-2 ${
                          isCurrentUser 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-900'
                        }`}>
                          {message.messageType === 'image' ? (
                            <div className="space-y-2">
                              <img 
                                src={message.attachments?.[0]} 
                                alt="Shared image" 
                                className="max-w-full rounded"
                              />
                              <p>{message.message}</p>
                            </div>
                          ) : message.messageType === 'pdf' ? (
                            <div className="flex items-center gap-2">
                              <span className="text-red-500">📄</span>
                              <span>{message.message}</span>
                            </div>
                          ) : (
                            <p>{message.message}</p>
                          )}
                        </div>
                        
                        <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${
                          isCurrentUser ? 'justify-end' : 'justify-start'
                        }`}>
                          <span>{formatTime(message.timestamp)}</span>
                          {isCurrentUser && (
                            message.isRead ? (
                              <CheckCheck className="h-3 w-3 text-blue-500" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 rounded-lg px-3 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept="image/*,.pdf,.doc,.docx"
              />
              <Button
                variant="ghost"
                size="sm"
              >
                <Smile className="h-4 w-4" />
              </Button>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                onFocus={() => handleTyping(true)}
                onBlur={() => handleTyping(false)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || !isConnected}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {!isConnected && (
              <div className="text-center text-sm text-red-500 mt-2">
                Connecting to chat server...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}