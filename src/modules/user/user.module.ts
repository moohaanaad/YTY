import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthGuard } from "src/guard/authentication.guard";
import { User, UserRepository, userSchema } from "src/models";
import { MessageService } from "src/utils";
import { CheckExistService } from "./checkExist.service";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";


@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: userSchema }])],
  controllers: [UserController],
  providers: [UserService, MessageService, AuthGuard,JwtService,
    ConfigService, UserRepository, CheckExistService]
})
export class UserModule { }
