import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PasswordService } from "src/common";
import { User, UserRepository, userSchema } from "src/models";
import { MailService, MessageService, OTPService } from "src/utils";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";


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
