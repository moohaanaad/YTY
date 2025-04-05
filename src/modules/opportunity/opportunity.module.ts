import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OpportunitiesService } from './opportunity.service';
import { OpportunitiesController } from './opportunity.controller';
import { Opportunity, OpportunitySchema } from 'src/models/opportunity/opportunity.schema';
import { MessageService } from 'src/utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserRepository, userSchema } from 'src/models';
import { ReactionService } from './reaction/reaction.service';
import { ReactionController } from './reaction/reaction.controller';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Opportunity.name, schema: OpportunitySchema },
    { name: User.name, schema: userSchema },

  ])],
  controllers: [OpportunitiesController, ReactionController],
  providers: [
    MessageService, JwtService, ConfigService, UserRepository,
    OpportunitiesService, ReactionService
  ],
})
export class OpportunityModule { }
