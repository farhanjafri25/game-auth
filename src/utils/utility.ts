import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class Utility{
    constructor() { }
    //Generate encrypted password string using bcrypt library
    async hashPassword(password: string): Promise <string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
    //Function to compare password string
    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}

  