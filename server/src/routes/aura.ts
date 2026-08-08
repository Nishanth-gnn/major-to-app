import { Router } from 'express';
import {
  handleAuraChat,
  listChats,
  createChat,
  getChatMessages,
  deleteChat,
} from '../controllers/auraController';

const router = Router();

router.post('/chat',        handleAuraChat);    // Send a message (with sliding-window)
router.post('/new-chat',    createChat);        // Create a new numbered chat
router.get('/chats',        listChats);         // List all chats
router.get('/chat/:id',     getChatMessages);   // Get all messages in a chat
router.delete('/chat/:id',  deleteChat);        // Delete a chat (cascades messages)

export default router;
