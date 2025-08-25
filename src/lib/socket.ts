import { Server } from 'socket.io'
import { db } from '@/lib/db'

interface ChatMessage {
  rfqId: string
  senderId: string
  receiverId: string
  messageText?: string
  attachments?: string[]
  timestamp: Date
}

interface JoinRoomData {
  rfqId: string
  userId: string
}

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id)
    
    // Join RFQ chat room
    socket.on('join_rfq_room', async (data: JoinRoomData) => {
      try {
        const { rfqId, userId } = data
        
        // Verify user has access to this RFQ
        const rfq = await db.rFQ.findFirst({
          where: {
            id: rfqId,
            OR: [
              { buyerId: userId },
              { sellerId: userId }
            ]
          }
        })

        if (rfq) {
          socket.join(`rfq_${rfqId}`)
          socket.data.userId = userId
          socket.data.rfqId = rfqId
          
          // Send recent chat history
          const recentMessages = await db.chat.findMany({
            where: { rfqId },
            include: {
              sender: {
                select: { id: true, name: true }
              },
              receiver: {
                select: { id: true, name: true }
              }
            },
            orderBy: { timestamp: 'desc' },
            take: 50
          })
          
          socket.emit('chat_history', recentMessages.reverse())
        } else {
          socket.emit('error', { message: 'Access denied to this RFQ' })
        }
      } catch (error) {
        console.error('Error joining RFQ room:', error)
        socket.emit('error', { message: 'Failed to join chat room' })
      }
    })

    // Handle chat messages
    socket.on('send_message', async (data: ChatMessage) => {
      try {
        const { rfqId, senderId, receiverId, messageText, attachments } = data
        
        // Verify sender is part of this RFQ
        const rfq = await db.rFQ.findFirst({
          where: {
            id: rfqId,
            OR: [
              { buyerId: senderId },
              { sellerId: senderId }
            ]
          }
        })

        if (!rfq) {
          socket.emit('error', { message: 'Access denied' })
          return
        }

        // Create chat message in database
        const chatMessage = await db.chat.create({
          data: {
            rfqId,
            senderId,
            receiverId,
            messageText,
            attachments: attachments ? JSON.stringify(attachments) : null,
            timestamp: new Date()
          },
          include: {
            sender: {
              select: { id: true, name: true }
            },
            receiver: {
              select: { id: true, name: true }
            }
          }
        })

        // Broadcast message to room
        io.to(`rfq_${rfqId}`).emit('new_message', chatMessage)

        // Update RFQ status if it's still open
        if (rfq.status === 'OPEN') {
          await db.rFQ.update({
            where: { id: rfqId },
            data: { status: 'IN_NEGOTIATION' }
          })
        }
      } catch (error) {
        console.error('Error sending message:', error)
        socket.emit('error', { message: 'Failed to send message' })
      }
    })

    // Handle file upload
    socket.on('upload_file', async (data: {
      rfqId: string
      senderId: string
      receiverId: string
      file: Buffer
      fileName: string
      fileType: string
    }) => {
      try {
        // In a real implementation, you would save the file to cloud storage
        // For now, we'll just acknowledge the upload
        const fileUrl = `/uploads/${data.fileName}` // Placeholder
        
        const chatMessage = await db.chat.create({
          data: {
            rfqId: data.rfqId,
            senderId: data.senderId,
            receiverId: data.receiverId,
            attachments: JSON.stringify([{
              url: fileUrl,
              name: data.fileName,
              type: data.fileType
            }]),
            timestamp: new Date()
          },
          include: {
            sender: {
              select: { id: true, name: true }
            },
            receiver: {
              select: { id: true, name: true }
            }
          }
        })

        io.to(`rfq_${data.rfqId}`).emit('new_message', chatMessage)
      } catch (error) {
        console.error('Error uploading file:', error)
        socket.emit('error', { message: 'Failed to upload file' })
      }
    })

    // Handle typing indicators
    socket.on('typing', (data: { rfqId: string, userId: string }) => {
      socket.to(`rfq_${data.rfqId}`).emit('user_typing', { userId: data.userId })
    })

    socket.on('stop_typing', (data: { rfqId: string, userId: string }) => {
      socket.to(`rfq_${data.rfqId}`).emit('user_stopped_typing', { userId: data.userId })
    })

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id)
    })

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to B2B Pakistan Chat',
      timestamp: new Date().toISOString()
    })
  })
}