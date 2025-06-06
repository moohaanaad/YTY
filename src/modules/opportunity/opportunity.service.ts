import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import { deleteFile } from 'src/common';
import { OpportunityRepository } from 'src/models/opportunity/opportunity.repository';
import { Opportunity } from 'src/models/opportunity/opportunity.schema';
import { MessageService } from 'src/utils';

@Injectable()
export class OpportunitiesService {
  constructor(
    private opportnuityRepo: OpportunityRepository,
    private messageService: MessageService
  ) { }

  //create opportunity
  async createOpportunity(req: any, body: any, file: Express.Multer.File) {

    const { user } = req

    //prepare data
    body.slug = slugify(body?.title)
    body.image = file?.path
    body.createdBy = user._id
    body.updatedBy = user._id

    //save data 
    const createdOpportunity = await this.opportnuityRepo.create(body)

    //if have error
    if (!createdOpportunity) {
      deleteFile(file.path)
      throw new BadRequestException()
    }

    //response
    return { success: true, data: createdOpportunity }

  }

  //get all opportunities
  async getOpportunities() {

    const opportunitiesExist = await this.opportnuityRepo.find().populate({
      path: "createdBy",
      select: "firstName lastName email userName profileImage"
    });

    if (!opportunitiesExist) {
      throw new NotFoundException(this.messageService.messages.opportunity.empty)
    }

    return { success: true, data: opportunitiesExist }

  }

  //get specific opportunity
  async getSpecificOpportunity(param: any) {
    const { opportunityId } = param

    //check existence
    const opportunityExist = await this.opportnuityRepo.findById(opportunityId).populate({
      path: "createdBy",
      select: "firstName lastName email userName profileImage"
    });
    if (!Opportunity) {
      throw new NotFoundException(this.messageService.messages.opportunity.notFound);
    }

    //response
    return { suceess: true, data: opportunityExist }
  }

  //get all opportunities of specific user
  async getAllOpportunitiesOfUser(req: any) {
    const { user } = req

    const opportunitiesExist = await this.opportnuityRepo.find({ createdBy: user._id }).populate({
      path: "createdBy",
      select: "firstName lastName email userName profileImage"
    });
    if (!opportunitiesExist) throw new NotFoundException(this.messageService.messages.opportunity.notFound)

    return { success: true, data: opportunitiesExist }
  }

  //update opportunity
  async updateOpportunity(param: any, req: any, body: any, file: Express.Multer.File) {
    const { opportunityId } = param
    const { user } = req
    const { title, slug, description, deadline } = body

    //check existence
    const opportunityExist = await this.opportnuityRepo.findOne(
      {
        _id: opportunityId,
        createdBy: user._id
      });
    if (!opportunityExist) {
      if (file) {
        deleteFile(file.path)
      }
      throw new NotFoundException(this.messageService.messages.opportunity.notFound);
    }

    if (file) {
      //delete old image
      deleteFile(opportunityExist?.image)

      // update new image 
      opportunityExist.image = file.path
    }

    //prepare data
    const updateableFields = {
      title,
      slug,
      description,
      deadline,
      updateBy: user._id
    }

    //change data 
    for (const [key, value] of Object.entries(updateableFields)) {
      if (value !== undefined) {
        opportunityExist[key] = value
      }
    }
    //save data
    await opportunityExist.save()

    //response
    return { success: true, data: opportunityExist }
  }

  //delete opportunity
  async deleteOpportunity(param: any, req: any) {
    const { opportunityId } = param
    const { user } = req

    //check existence
    const opportunityExist = await this.opportnuityRepo.findOneAndDelete({
       _id: opportunityId,
        createdBy: user._id 
      });
    if (!opportunityExist) {
      throw new NotFoundException(this.messageService.messages.opportunity.notFound);

    }

    //delete old image
    if (opportunityExist?.image && opportunityExist.image !== 'uploads\\opportunity\\opportunity-Avatar.jpg') {
      await deleteFile(opportunityExist?.image)

    }

    //response
    return { success: true }

  }

}
