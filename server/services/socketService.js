import { Server } from 'socket.io';

let io = null;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // 加入房间以便广播
    socket.on('join-room', () => {
      socket.join('todos-room');
      console.log(`Client ${socket.id} joined todos-room`);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

// 广播 Todo 变更
export const broadcastTodoChange = (event, data) => {
  if (io) {
    io.to('todos-room').emit(event, data);
  }
};

