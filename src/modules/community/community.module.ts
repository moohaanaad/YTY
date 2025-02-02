import { Module } from '@nestjs/common';
import { CommunityService } from './community.service';
import { CommunityController } from './community.controller';
import { MessageService } from 'src/utils';
import { MongooseModule } from '@nestjs/mongoose';
import { Community, CommunityRepository, communitySchema, Subcategory, SubcategoryRepository, subcategorySchema, User, UserRepository, userSchema } from 'src/models';
import { PasswordService } from 'src/common/hashAndComparePassword/password.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/utils/mail.service';
import { OTPService } from 'src/utils/OTP.service';

@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name, schema: userSchema },
    { name: Community.name, schema: communitySchema },
    { name: Subcategory.name, schema: subcategorySchema }
  ])],
  providers: [CommunityService, MessageService, CommunityRepository, SubcategoryRepository, UserRepository,
    PasswordService,
    JwtService,
    ConfigService,
    MailService,
    OTPService],
  controllers: [CommunityController]
})
export class CommunityModule { }
