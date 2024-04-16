import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtStrategy } from '../../jwt.strategy';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private rooms: Map<string, Set<string>> = new Map();
  private userRooms: Map<string, string> = new Map();
  private roomsSet = new Set();
  constructor(private authService: JwtStrategy) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    console.log('AppGateway ~ handleConnection ~ socket:', socket.id);
    const token = socket.handshake.headers.authorization;
    console.log('AppGateway ~ handleConnection ~ token:', token);
    const user = await this.authService.validateUser(token);
    if (!user) {
      socket.disconnect(true);
      return;
    }
    socket.join(user.userId);
  }

  async handleDisconnect(socket: Socket) {
    console.log('AppGateway ~ handleDisconnect ~ socket:', socket.id);
    const token = socket.handshake.headers.authorization;
    const user = await this.authService.validateUser(token);
    if (user) {
      socket.leave(user.userId);
    }
  }

  public addUserToRoomId(roomId: string, userId: string) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId).add(userId);
    console.log(`roooms Map`, this.rooms);
    return;
  }

  public addRoomToUserId(roomId: string, userId: string) {
    if (!this.userRooms.has(userId)) {
      this.userRooms.set(userId, roomId);
    } else {
      this.userRooms.set(userId, roomId);
    }
    console.log(`user Rooms map`, this.userRooms);
    return;
  }

  public getAvailableRooms() {
    if (this.roomsSet.size > 0) {
      const arrayFromSet = Array.from(this.roomsSet);
      const randomIndex = Math.floor(Math.random() * arrayFromSet.length);
      return arrayFromSet[randomIndex];
    } else {
      const newRoomId = uuidv4();
      this.roomsSet.add(newRoomId);
      return newRoomId;
    }
  }

  @SubscribeMessage(`game:init`)
  async handleMessage(
    @MessageBody() body: any,
    @ConnectedSocket() socket: Socket,
  ) {
    const token = socket.handshake.headers.authorization;
    const user = await this.authService.validateUser(token);
    if (!user) {
      socket.disconnect(true);
      return;
    }
    const roomId = body.roomId;
    socket.join(`${roomId}`);
    if (this.rooms.get(`${roomId}`).size >= 2) {
      this.server
        .to(`${roomId}`)
        .emit('game:init', 'Opponent Match found! Quiz Started');
    }
  }
}
