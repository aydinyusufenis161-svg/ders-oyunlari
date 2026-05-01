import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class SocketService {
  public socket: Socket | null = null;
  private roomId: string | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        transports: ['websocket'],
      });
      
      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server:', this.socket?.id);
        if (this.roomId) {
          this.socket?.emit('join_room', this.roomId);
        }
      });
      
      this.socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
      });
    }
  }

  joinRoom(roomId: string) {
    if (!this.socket) this.connect();
    this.roomId = roomId;
    this.socket?.emit('join_room', roomId);
  }

  syncState(state: any) {
    if (this.socket && this.roomId) {
      this.socket.emit('sync_state', { roomId: this.roomId, state });
    }
  }

  emitSpin(result: any) {
    if (this.socket && this.roomId) {
      this.socket.emit('spin_wheel', { roomId: this.roomId, result });
    }
  }

  onStateUpdated(callback: (state: any) => void) {
    if (!this.socket) this.connect();
    this.socket?.off('state_updated');
    this.socket?.on('state_updated', callback);
  }

  onWheelSpun(callback: (result: any) => void) {
    if (!this.socket) this.connect();
    this.socket?.off('wheel_spun');
    this.socket?.on('wheel_spun', callback);
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.roomId = null;
  }
}

export const socketService = new SocketService();
