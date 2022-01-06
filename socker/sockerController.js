import { Server } from 'socket.io';
import redisAdapter from 'socket.io-redis';

const REDIS_HOST = "";
const REDIS_PORT = "";

const app = app => {
  const io = new Server(app, {
    transports: ['websocket'], // to avoid sticky session when using multiple servers
    path: '/test',
    // cors:,
    rememberUpgrade: true,
  });

  // redis setup
  try {
    const adapter = redisAdapter({ host: REDIS_HOST, port: Number(REDIS_PORT) });
    io.adapter = adapter;
  }
  catch (e) {
    console.error("Redis not found");
    console.error(e);
  }

  console.log("Socketio initialized!");

  const game = io.of('/test');
  game.on('connection', async socket => {
    const { username, roomId, action, options } = socket.handshake.query;
    // room logic

    console.log('Client connected!');

    // more room logic about join room and disconnect room

    return io;
  });

};

export default app;