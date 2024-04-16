import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserLoginInterface, UserSignUpInterface } from 'src/interface/user.interface';
import { Utility } from '../../utils/utility';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly utility: Utility,
    private readonly jwtService: JwtService,
  ) {}

  public async saveUser(body: UserSignUpInterface) {
   console.log("UserService ~ saveUser ~ body:", body);
   try {
     const hashedPassord = await this.utility.hashPassword(body.password);
     const saveUser = await this.userRepository.saveUser({
       ...body,
       password: hashedPassord,
     });
     if (!saveUser) {
       throw new BadRequestException('Something went wrong');
     }
     const accessToken = this.jwtService.sign({userId: saveUser.userId, email: saveUser.email}, {
       expiresIn: '1d',
     });
     return {
       ...saveUser,
       accessToken,
     };
   } catch (error) {
    console.log("UserService ~ saveUser ~ error:", error);
    throw new BadRequestException('Something went wrong')
   }
  }
    
    async loginUser(body: UserLoginInterface) {
        const getUserByEmail = await this.userRepository.getUserByEmail(body.email);
        if (!getUserByEmail) throw new UnauthorizedException('User not found')
        const matchPasswords = await this.utility.comparePassword(body.password, getUserByEmail.password)
        if (!matchPasswords) throw new UnauthorizedException('Passwords do not match');
        const accessToken = this.jwtService.sign({ userId: getUserByEmail.userId, email: getUserByEmail.email }, {
            expiresIn: '1d'
        });
        return {
            userId: getUserByEmail.userId,
            email: getUserByEmail.email,
            accessToken
        }
    }
}
