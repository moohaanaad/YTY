import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OpportunitiesService } from './opportunities.service';
import { OpportunitiesController } from './opportunities.controller';
import { Opportunity, OpportunitySchema } from 'src/models/opportunity/opportunity.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Opportunity.name, schema: OpportunitySchema }])],
  controllers: [OpportunitiesController],
  providers: [OpportunitiesService],
})
export class OpportunitiesModule {}
