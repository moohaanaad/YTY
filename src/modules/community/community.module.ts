import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PasswordService } from "src/common";
import { Community, CommunityRepository, communitySchema, Subcategory, SubcategoryRepository, subcategorySchema, User, UserRepository, userSchema } from "src/models";
import { MailService, MessageService, OTPService } from "src/utils";
import { CommunityController } from "./community.controller";
import { CommunityService } from "./community.service";
import { JoinController } from "./join-community/join.controller";
import { JoinService } from "./join-community/join.service";


@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: userSchema },
    { name: Community.name, schema: communitySchema },
    { name: Subcategory.name, schema: subcategorySchema }
  ])],
  providers: [CommunityService, JoinService, MessageService, CommunityRepository, SubcategoryRepository, UserRepository,
    PasswordService,
    JwtService,
    ConfigService,
    MailService,
    OTPService],
  controllers: [CommunityController, JoinController ]
})
export class CommunityModule { }
