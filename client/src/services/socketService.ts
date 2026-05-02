import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function> = new Map();

  connect() {
    if (this.socket?.connected) return;

    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    const DEFAULT_SERVER_URL = isLocalhost ? 'http://localhost:3001' : 'https://ders-oyunlari-api.onrender.com';

    const SERVER_URL = import.meta.env.VITE_API_URL 
      ? import.meta.env.VITE_API_URL.replace('/api', '') 
      : DEFAULT_SERVER_URL;

    this.socket = io(SERVER_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server:', this.socket?.id);
    });

    this.socket.on('state_updated', (state) => {
      const listener = this.listeners.get('state_updated');
      if (listener) listener(state);
    });

    this.socket.on('wheel_spun', (result) => {
      const listener = this.listeners.get('wheel_spun');
      if (listener) listener(result);
    });

    this.socket.on('state_requested', () => {
      const listener = this.listeners.get('state_requested');
      if (listener) listener();
    });
  }

  joinRoom(roomId: string) {
    if (!this.socket) this.connect();
    this.socket?.emit('join_room', roomId);
    // Request state from the host
    this.socket?.emit('request_state', roomId);
  }

  syncState(state: any) {
    if (!this.socket) return;
    this.socket.emit('sync_state', { roomId: state.id, state });
  }

  spinWheel(roomId: string, result: any) {
    if (!this.socket) return;
    this.socket.emit('spin_wheel', { roomId, result });
  }

  onStateUpdated(callback: (state: any) => void) {
    this.listeners.set('state_updated', callback);
  }

  onWheelSpun(callback: (result: any) => void) {
    this.listeners.set('wheel_spun', callback);
  }

  onStateRequested(callback: () => void) {
    this.listeners.set('state_requested', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
