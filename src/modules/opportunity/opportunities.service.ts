import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Opportunity, OpportunityDocument } from 'src/models/opportunity/opportunity.schema';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';

@Injectable()
export class OpportunitiesService {
  constructor(
    @InjectModel(Opportunity.name) private opportunityModel: Model<OpportunityDocument>,
  ) {}

  async create(createOpportunityDto: CreateOpportunityDto, userId: string): Promise<Opportunity> {
    const newOpportunity = new this.opportunityModel({ ...createOpportunityDto, createdBy: userId });
    return newOpportunity.save();
  }

  async findAll(): Promise<Opportunity[]> {
    return this.opportunityModel.find().populate('createdBy', 'email');
  }

  async findOne(id: string): Promise<Opportunity> {
    const opportunity = await this.opportunityModel.findById(id);
    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }
    return opportunity;
  }

  async update(id: string, updateOpportunityDto: UpdateOpportunityDto, userId: string): Promise<Opportunity> {
    const opportunity = await this.opportunityModel.findById(id);
    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }
    if (opportunity.createdBy.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to update this opportunity');
    }
    return this.opportunityModel.findByIdAndUpdate(id, updateOpportunityDto, { new: true });
  }

  async delete(id: string, userId: string): Promise<void> {
    const opportunity = await this.opportunityModel.findById(id);
    if (!opportunity) {
      throw new NotFoundException('Opportunity not found');
    }
    if (opportunity.createdBy.toString() !== userId) {
      throw new ForbiddenException('You are not authorized to delete this opportunity');
    }
    await this.opportunityModel.findByIdAndDelete(id);
  }
}
