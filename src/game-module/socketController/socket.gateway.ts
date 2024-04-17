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
import { GameRepository } from '../repositories/game.repository';
import {
  AnswerSubmitInterface,
  GameInitInterface,
} from '../../interface/game.interface';

@WebSocketGateway()
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private rooms: Map<string, Set<string>> = new Map();
  private userRooms: Map<string, string> = new Map();
  private roomsSet = new Set();
  private userAnswers: Map<string, number> = new Map();
  private userQuestionIndex: Map<string, number> = new Map();
  constructor(
    private authService: JwtStrategy,
    private readonly questionRepository: GameRepository,
  ) {}

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
    if (this.rooms.get(roomId).size >= 2) {
      this.roomsSet.delete(roomId);
    }
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
    @MessageBody() body: GameInitInterface,
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
      const question = await this.questionRepository.getQuestions(0, 1);
      this.server.to(`${roomId}`).emit('game:init', { question, nextPage: 1 });
      return;
    }
  }

  @SubscribeMessage(`question:send`)
  async sendQuestion(@ConnectedSocket() socket: Socket) {
  }

  @SubscribeMessage('answer:submit')
  async submitAnswer(
    @MessageBody() body: AnswerSubmitInterface,
    @ConnectedSocket() socket: Socket,
  ) {
    const token = socket.handshake.headers.authorization;
    const user = await this.authService.validateUser(token);
    if (!user) {
      socket.disconnect(true);
      return;
    }
    const { quesId, ans } = body;
    const questionData = await this.questionRepository.getQuestionById(quesId);
    if (questionData) {
      if (questionData.correctAnswer === ans) {
        if (!this.userAnswers.has(user.userId)) {
          this.userAnswers.set(user.userId, 1);
        } else {
          const currentCount = this.userAnswers.get(user.userId);
          this.userAnswers.set(user.userId, currentCount + 1);
        }
      }
    }
    console.log(`score data ---->`, this.userAnswers.get(`${user.userId}`));

    const nextQuestion = await this.questionRepository.getQuestions(
      body.nextPage,
      body.pageSize,
    );
    this.userQuestionIndex.set(`${user.userId}`, body.nextPage);
    if (!nextQuestion.length) {
      const roomId = this.userRooms.get(`${user.userId}`);
      const usersSet = this.rooms.get(`${roomId}`);
      const userIdsArr = [...usersSet];
      this.server
        .to(`${roomId}`)
        .emit(
          'game:end',
          `Winner is ${user.email}, score: ${this.userAnswers.get(`${user.userId}`)}`,
        );
      await this.saveUserScoreData(userIdsArr, roomId);
      return;
    }
    this.server
      .to(`${user.userId}`)
      .emit('question:send', { nextQuestion, nextPage: body.nextPage + 1 });
  }

  @SubscribeMessage('game:end')
  async gameEnd(@ConnectedSocket() socket: Socket) {}

  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(
    @MessageBody() data: { roomId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const token = socket.handshake.headers.authorization;
    const user = await this.authService.validateUser(token);
    const { roomId } = data;
    socket.leave(roomId);
    this.userRooms.delete(user.userId);
    console.log(`Client ${socket.id} left room ${roomId}`);
  }

  private async saveUserScoreData(userIds: string[], roomId: string) {
    if (!userIds.length) {
      return;
    }
    userIds.forEach((ele) => {
      this.questionRepository.saveGameScore(
        ele,
        roomId,
        this.userAnswers.get(`${ele}`),
      );
      this.userAnswers.delete(`${ele}`);
    });
    return;
  }
}
