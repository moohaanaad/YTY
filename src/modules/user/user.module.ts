import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/models/user/user.schema';
import { UserRepository } from 'src/models/user/user.repository';
import { CheckExistService } from './checkExist.service';
import { MessageService } from 'src/utils';
import { AuthGuard } from 'src/guard/authentication.guard';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: userSchema }])],
  controllers: [UserController],
  providers: [UserService, MessageService, AuthGuard,JwtService,
    ConfigService, UserRepository, CheckExistService]
})
export class UserModule { }
