import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OpportunitiesService } from './opportunity.service';
import { OpportunitiesController } from './opportunity.controller';
import { Opportunity, OpportunitySchema } from 'src/models/opportunity/opportunity.schema';
import { MessageService } from 'src/utils';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/models';

@Module({
  imports: [MongooseModule.forFeature([{ name: Opportunity.name, schema: OpportunitySchema }])],
  controllers: [OpportunitiesController],
  providers: [
     MessageService, JwtService, ConfigService, UserRepository,
    OpportunitiesService
  ],
})
export class OpportunityModule {}
