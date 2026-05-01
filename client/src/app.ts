import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import aiRoutes from './routes/aiRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const PORT = parseInt(process.env.PORT || '3001', 10);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '5mb' }));

app.use('/api/ai', aiRoutes);
app.use('/api/games', gameRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

io.on('connection', (socket) => {
  socket.on('join_room', (roomId: string) => {
    socket.join(roomId);
  });
  socket.on('sync_state', ({ roomId, state }: { roomId: string, state: any }) => {
    socket.to(roomId).emit('state_updated', state);
  });
  socket.on('spin_wheel', ({ roomId, result }: { roomId: string, result: any }) => {
    socket.to(roomId).emit('wheel_spun', result);
  });
});

if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDistPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

httpServer.listen(PORT, () => {
  console.log(`Ders Oyunlari Server running on port ${PORT}`);
});
