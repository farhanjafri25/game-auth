import { BadRequestException, Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { UserLoginDto, UserSignUpDto } from "src/dto/user.dto";
import { UserService } from "../services/user.service";
import { v4 as uuidv4 } from 'uuid';
import { AppInterceptor } from "src/app.interceptor";
import { Public } from "../../decorators";


@UseInterceptors(AppInterceptor)
@Controller('/users')
export class UserController {
    constructor(private userService: UserService) { }
    //Public decorator to make API skip authorization middleware
    @Public()
    @Post('/register')
    //Register user API
    async signUser(@Body() body: UserSignUpDto) {
        if (!body.email || !body.password || !body.confirmPassword) {
            throw new BadRequestException('All fields are required')
        }
        if (body.password !== body.confirmPassword) {
            throw new BadRequestException('Passwords do not match')
        }
        const saveUser = await this.userService.saveUser({ ...body, userId: uuidv4() });
        return saveUser
    }
    //Login API
    @Public()
    @Post('/login')
    async loginUser(@Body() body: UserLoginDto) {
        if (!body.email || !body.password) {
            throw new BadRequestException('All fields are required')
        }
        const loginUser = await this.userService.loginUser(body);
        return loginUser;
    }
} 