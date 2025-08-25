import { Server } from 'socket.io';
import { db } from '@/lib/db';

interface ChatMessage {
  rfqId: string;
  senderId: string;
  receiverId: string;
  message: string;
  attachments?: string[];
  messageType?: string;
}

interface JoinRoomData {
  rfqId: string;
  userId: string;
}

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Join RFQ chat room
    socket.on('join_rfq_room', async (data: JoinRoomData) => {
      try {
        const { rfqId, userId } = data;
        
        // Join the room for this RFQ
        socket.join(`rfq_${rfqId}`);
        
        // Mark previous messages as read for this user
        await db.chat.updateMany({
          where: {
            rfqId: rfqId,
            receiverId: userId,
            isRead: false
          },
          data: {
            isRead: true
          }
        });
        
        console.log(`User ${userId} joined RFQ room ${rfqId}`);
        
        // Send confirmation
        socket.emit('room_joined', { rfqId, success: true });
      } catch (error) {
        console.error('Error joining RFQ room:', error);
        socket.emit('room_joined', { success: false, error: 'Failed to join room' });
      }
    });

    // Handle chat messages
    socket.on('send_message', async (data: ChatMessage) => {
      try {
        const { rfqId, senderId, receiverId, message, attachments = [], messageType = 'text' } = data;
        
        // Save message to database
        const chatMessage = await db.chat.create({
          data: {
            rfqId,
            senderId,
            receiverId,
            message,
            attachments: JSON.stringify(attachments),
            messageType,
            timestamp: new Date(),
            isRead: false
          }
        });

        // Prepare message for broadcasting
        const broadcastMessage = {
          id: chatMessage.id,
          rfqId,
          senderId,
          receiverId,
          message,
          attachments,
          messageType,
          timestamp: chatMessage.timestamp,
          isRead: false
        };

        // Broadcast to all users in the RFQ room except sender
        socket.to(`rfq_${rfqId}`).emit('new_message', broadcastMessage);
        
        // Send confirmation back to sender
        socket.emit('message_sent', { success: true, messageId: chatMessage.id });
        
        console.log(`Message sent in RFQ ${rfqId} from ${senderId} to ${receiverId}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message_sent', { success: false, error: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing', (data: { rfqId: string; userId: string; isTyping: boolean }) => {
      socket.to(`rfq_${data.rfqId}`).emit('user_typing', {
        userId: data.userId,
        isTyping: data.isTyping
      });
    });

    // Handle read receipts
    socket.on('mark_messages_read', async (data: { rfqId: string; userId: string; senderId: string }) => {
      try {
        const { rfqId, userId, senderId } = data;
        
        // Mark messages as read
        await db.chat.updateMany({
          where: {
            rfqId: rfqId,
            senderId: senderId,
            receiverId: userId,
            isRead: false
          },
          data: {
            isRead: true
          }
        });

        // Notify sender that messages were read
        socket.to(`rfq_${rfqId}`).emit('messages_read', {
          rfqId,
          userId,
          senderId
        });
        
        console.log(`Messages marked as read for RFQ ${rfqId} by user ${userId}`);
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    // Handle file upload (placeholder - would integrate with actual file storage)
    socket.on('upload_file', async (data: { rfqId: string; senderId: string; receiverId: string; fileData: any; fileName: string; fileType: string }) => {
      try {
        // In a real implementation, you would:
        // 1. Upload file to cloud storage (S3, Cloudinary, etc.)
        // 2. Get the file URL
        // 3. Save the file info to database
        // 4. Send the file URL as a message
        
        const fileUrl = `https://example.com/files/${data.fileName}`; // Placeholder URL
        
        // Create file message
        const chatMessage = await db.chat.create({
          data: {
            rfqId: data.rfqId,
            senderId: data.senderId,
            receiverId: data.receiverId,
            message: data.fileName,
            attachments: JSON.stringify([fileUrl]),
            messageType: data.fileType,
            timestamp: new Date(),
            isRead: false
          }
        });

        const broadcastMessage = {
          id: chatMessage.id,
          rfqId: data.rfqId,
          senderId: data.senderId,
          receiverId: data.receiverId,
          message: data.fileName,
          attachments: [fileUrl],
          messageType: data.fileType,
          timestamp: chatMessage.timestamp,
          isRead: false
        };

        // Broadcast file message
        socket.to(`rfq_${data.rfqId}`).emit('new_message', broadcastMessage);
        socket.emit('file_uploaded', { success: true, messageId: chatMessage.id });
        
        console.log(`File uploaded for RFQ ${data.rfqId}: ${data.fileName}`);
      } catch (error) {
        console.error('Error uploading file:', error);
        socket.emit('file_uploaded', { success: false, error: 'Failed to upload file' });
      }
    });

    // Get chat history for an RFQ
    socket.on('get_chat_history', async (data: { rfqId: string; userId: string }) => {
      try {
        const { rfqId, userId } = data;
        
        // Get chat messages for this RFQ involving this user
        const messages = await db.chat.findMany({
          where: {
            rfqId: rfqId,
            OR: [
              { senderId: userId },
              { receiverId: userId }
            ]
          },
          orderBy: {
            timestamp: 'asc'
          }
        });

        // Format messages for client
        const formattedMessages = messages.map(msg => ({
          id: msg.id,
          rfqId: msg.rfqId,
          senderId: msg.senderId,
          receiverId: msg.receiverId,
          message: msg.message,
          attachments: msg.attachments ? JSON.parse(msg.attachments) : [],
          messageType: msg.messageType,
          timestamp: msg.timestamp,
          isRead: msg.isRead
        }));

        socket.emit('chat_history', { rfqId, messages: formattedMessages });
        
        console.log(`Chat history sent for RFQ ${rfqId} to user ${userId}`);
      } catch (error) {
        console.error('Error getting chat history:', error);
        socket.emit('chat_history', { rfqId: data.rfqId, messages: [], error: 'Failed to load chat history' });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to B2B Marketplace Chat',
      timestamp: new Date().toISOString(),
    });
  });
};