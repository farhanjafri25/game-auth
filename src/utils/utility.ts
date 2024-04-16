import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class Utility{
    constructor() { }

    async hashPassword(password: string): Promise <string> {
        const saltRounds = 10;
        return bcrypt.hash(password, saltRounds);
    }
    
    async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}

  