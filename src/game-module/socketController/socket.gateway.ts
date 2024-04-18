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
  //Creating a Rooms map which stores userIds joined a particular room
  private rooms: Map<string, Set<string>> = new Map();
  //A userRooms Map which stores userId and roomId of that userId
  private userRooms: Map<string, string> = new Map();
  //A roomSet, a set data structure which stores the available rooms present
  private roomsSet = new Set();
  //UserAnswers a map to store the userId and to store the score user has scored by giving correct answers
  private userAnswers: Map<string, number> = new Map();
  //A variable to store the question pointer user as accessed
  private userQuestionIndex: Map<string, number> = new Map();
  constructor(
    private authService: JwtStrategy,
    private readonly questionRepository: GameRepository,
  ) {}

  @WebSocketServer()
  server: Server;
  /*Handle connection function, This function gets invoked when ever a user is connecting to socket.
 A validation check to check if incoming request is authorized.
 Join the socket to a userId, mainly done as because the socketId changes on each connections
    */
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
  /* Handle disconnect function to remove user from the socket when ever user disconnects */
  async handleDisconnect(socket: Socket) {
    console.log('AppGateway ~ handleDisconnect ~ socket:', socket.id);
    const token = socket.handshake.headers.authorization;
    const user = await this.authService.validateUser(token);
    if (user) {
      socket.leave(user.userId);
    }
  }
  /* Function to add user to a roomId in map, the function checks if a roomId is present in map,
  if not it creates a key.
  The other check is to remove room form rooms set, thus making the room unavailable for more users to join the room */
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
  /* Function to add a roomId to a user, this done to keep a record of which room a user is belonging to */
  public addRoomToUserId(roomId: string, userId: string) {
    if (!this.userRooms.has(userId)) {
      this.userRooms.set(userId, roomId);
    } else {
      this.userRooms.set(userId, roomId);
    }
    console.log(`user Rooms map`, this.userRooms);
    return;
  }

  /* Function to get the rooms which have space left for a user to join, 
    it randomly picks from the set and returns the roomId.
    If no rooms are present then a new room id is created and returned */
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
  /* Patten to subsribe to game:init, it takes in a roomId and joins the requesting user to that room.
  If there are 2 persons who have joined the room then we'll fetch a question from Mongo to serve it to both the players,
  the socket emits the question to the roomId so that both the players recieve the question upon a match */
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
  //Pattern to subscribe on question:send pattern
  @SubscribeMessage(`question:send`)
  async sendQuestion(@ConnectedSocket() socket: Socket) {}

  /*Ans:submit message Pattern accepts a body which has questionId, ans text and the nextPage.*/
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
      /*Fetch question data related to question Id to check for correct answer.
      If correct increase user score count by 1 */
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
//Get the next question to serve it to the user, nextPage is used to skip the no of questions already served
    const nextQuestion = await this.questionRepository.getQuestions(
      body.nextPage,
      body.pageSize,
    );
      this.userQuestionIndex.set(`${user.userId}`, body.nextPage);
      /*If no question is found then it means the user has answered all the questions,
       and emit on game:end pattern to let users know about the winner and the score he obtained*/
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

  //Subscribe to game:end pattern to broadcast users present in a room about the game end
  @SubscribeMessage('game:end')
  async gameEnd(@ConnectedSocket() socket: Socket) {}

  //Pattern to leave a room, this accepts a roomId and disconnects from the room
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
  //Function to save user score data to mongoDb and remove the scores from the user answers map
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
