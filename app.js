import socker from './socker/sockerController';
import express from 'express';
import http from 'http';

// https://dev.to/sauravmh/building-a-multiplayer-game-using-websockets-1n63

const API_PORT = 9000;

const app = express();
const server = new http.Server(app);
socker(server);

app.listen(API_PORT, () => {
  logger.info(`Api listening on port ${Number(API_PORT)}!`);
});

server.listen(Number(API_PORT) + 1, () => {
  logger.info(`Socker listening on port ${Number(API_PORT) + 1}!`);
//   logger.info(`Api and socker whitelisted for ${host}`);
});