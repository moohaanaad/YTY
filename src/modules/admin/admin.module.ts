import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Community, CommunityRepository, communitySchema, User, UserRepository, userSchema } from 'src/models';
import { OpportunityRepository } from 'src/models/opportunity/opportunity.repository';
import { JwtService } from '@nestjs/jwt';
import { MessageService } from 'src/utils';
import { RolesGuard } from 'src/guard/roles.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { Opportunity, OpportunitySchema } from 'src/models/opportunity/opportunity.schema';

@Module({
  imports: [MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Community.name, schema: communitySchema },
      { name: Opportunity.name, schema: OpportunitySchema }  
    ])],
  controllers: [AdminController],
  providers: [AdminService,UserRepository,CommunityRepository,OpportunityRepository,JwtService,MessageService,RolesGuard],
})
export class AdminModule {}
