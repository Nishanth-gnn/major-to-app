import { io, Socket } from 'socket.io-client';
import { API_ORIGIN } from './api/config';

let socket: Socket | undefined;

export function getSupportSocket(): Socket {
  if (!socket) {
    socket = io(API_ORIGIN, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
  }
  return socket;
}
