import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import chatRoutes from './routes/chat';
import transitRoutes from './routes/transit';
import luggageRoutes from './routes/luggage';
import emergencyRoutes from './routes/emergency';
import supportRoutes from './routes/support';
import https from 'https';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { startTelegramLongPolling } from './services/telegramService';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/transit', transitRoutes);
app.use('/api/luggage', luggageRoutes);
app.use('/api/emergency-alert', emergencyRoutes);
app.use('/api/support', supportRoutes);

app.get('/api/tts', (req, res) => {
  const { text, lang } = req.query;
  if (!text || !lang) return res.status(400).send('Missing text or lang');

  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(text as string)}`;

  https.get(url, (googleRes) => {
    res.set('Content-Type', 'audio/mpeg');
    googleRes.pipe(res);
  }).on('error', (err) => {
    console.error('TTS proxy error:', err);
    res.status(500).send('TTS proxy error');
  });
});

const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start Telegram long polling loop and forward updates via Socket.IO
startTelegramLongPolling((text) => {
  console.log('Telegram reply received:', text);
  io.emit('support-reply', {
    sender: 'staff',
    text,
    timestamp: new Date()
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
