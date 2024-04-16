import { BadRequestException, Injectable } from "@nestjs/common";
import { AppGateway } from "../socketController/socket.gateway";

@Injectable()
export class GameService {
    constructor(private appGateWay: AppGateway) { }
    
    async createRoom(userId: string) {
        try {
            const roomId = this.appGateWay.getAvailableRooms();
            this.appGateWay.addUserToRoomId(roomId, userId);
            this.appGateWay.addRoomToUserId(roomId, userId);
            return {
                message: "You will be redirected shortly",
                roomId: roomId,
            }
        } catch (error) {
            console.log("GameService ~ createRoom ~ error:", error);
            return null;
        }
    }
 }
