import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import aiRoutes from './routes/aiRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const httpServer = createServer(app);
const PORT = parseInt(process.env.PORT || '3001', 10);

const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};

const io = new Server(httpServer, {
  cors: corsOptions
});

app.use(cors(corsOptions));
app.use(express.json({ limit: '5mb' }));

app.use('/api/ai', aiRoutes);
app.use('/api/games', gameRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

io.on('connection', (socket) => {
  console.log(`New connection: ${socket.id}`);

  socket.on('join_room', (roomId: string) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('sync_state', ({ roomId, state }: { roomId: string, state: any }) => {
    socket.to(roomId).emit('state_updated', state);
  });
  
  socket.on('request_state', (roomId: string) => {
    socket.to(roomId).emit('state_requested');
  });
  
  socket.on('spin_wheel', ({ roomId, result }: { roomId: string, result: any }) => {
    socket.to(roomId).emit('wheel_spun', result);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`EduWheel Server with Socket.io running on http://localhost:${PORT}`);
});
