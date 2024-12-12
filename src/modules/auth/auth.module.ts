import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from 'src/models/user/user.repository';
import { MessageService } from 'src/utils';
import { PasswordService } from 'src/common/hashAndComparePassword/password.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/utils/mail.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/models/user/user.schema';
import { OTPService } from 'src/utils/OTP.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: userSchema }])],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    MessageService,
    PasswordService,
    JwtService,
    ConfigService,
    MailService,
    OTPService

  ]
})
export class AuthModule { }
