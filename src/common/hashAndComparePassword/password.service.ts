import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'


@Injectable()
export class PasswordService {
    private saltRounds: number
    constructor(private configService: ConfigService) {
        this.saltRounds = parseInt(this.configService.get<string>('SECPRET_ROUNDS'));
    }
    hashPassword = (password: string) => {
        return bcrypt.hash(password, this.saltRounds) //config
    }

    compare = (password: string, hashedPassword: string) => {
        return bcrypt.compare(password, hashedPassword)
    }
}