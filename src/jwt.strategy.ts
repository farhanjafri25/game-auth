import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserRepository } from './user-module/repositories/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly appRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'JwtSecret',
    });
  }
    //Validate function to fetch user by ID from DB and check against his data, return unauthorised if not present
  async validate(payload: any): Promise<any> {
    const { userId } = payload;
    const user = await this.appRepository.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      id: user.id,
      userId: user.userId,
      email: user.email,
    };
  }
  async validateUser(payload: any) {
    // Validate the JWT token and return the user
    const decode = this.jwtService.verify(payload, {
      secret: 'JwtSecret',
    });
    console.log(decode);
    const { userId } = decode;
    const user = await this.appRepository.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      id: user.id,
      userId: user.userId,
      email: user.email,
    };
  }
}
