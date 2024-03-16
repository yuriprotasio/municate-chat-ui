import { io } from 'socket.io-client';

const URL = 'http://192.168.100.158:3003';

export const socket = io(URL);