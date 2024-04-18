import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { Utility } from '../utils/utility';
import { JwtStrategy } from '../jwt.strategy';
import { UserController } from './controllers/user.controller';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../model/user.model';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    JwtModule.register({
      secret: `${process.env.JWT_SECRET}`,
    }),
    MongooseModule.forFeature([{ name: 'users_data', schema: UserSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, JwtStrategy, Utility],
  exports: [UserService, UserRepository, JwtStrategy, Utility],
})
export class UserModule {}
