import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { OpportunitiesService } from './opportunity.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { Roles } from 'src/modules/authorization/roles.decorator';
import { UserRole } from 'src/utils';
import { RolesGuard } from 'src/guard/roles.guard';
import { AuthGuard } from 'src/guard/authentication.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { dS, fileValidation, fileValidationTypes } from 'src/common';


@Controller('opportunity')
@UseGuards(AuthGuard, RolesGuard)
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) { }

  //create opportunity
  @Post()
  @Roles(UserRole.ADMIN, UserRole.VOLUNTEER)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: dS('uploads/opportunity'),
      fileFilter: fileValidation(fileValidationTypes.image)
    }))
  async createOpportunity(@Req() req: any, @Body() body: CreateOpportunityDto, @UploadedFile() file: Express.Multer.File) {
    return this.opportunitiesService.createOpportunity(req, body, file);
  }

  //get all opportunities
  @Get()
  async getOpportunities() {
    return this.opportunitiesService.getOpportunities();
  }

  @Get('user')
  async getAllOpportunitiesOfUser(@Req() req:any) {
    return this.opportunitiesService.getAllOpportunitiesOfUser(req)
  }

  //get specific opportunity
  @Get(':opportunityId')
  async getSpecificOpportunity(@Param() Param: string) {
    return this.opportunitiesService.getSpecificOpportunity(Param);
  }

  //update opportunity
  @Put(':opportunityId')
  @Roles(UserRole.VOLUNTEER, UserRole.ADMIN)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: dS('uploads/opportunity'),
      fileFilter: fileValidation(fileValidationTypes.image)
    }))
  async updateOpportunity(@Param() param: any, @Req() req: any, @Body() body: UpdateOpportunityDto, @UploadedFile() file: Express.Multer.File) {
    return this.opportunitiesService.updateOpportunity(param, req, body, file);
  }

  //delete opportunity
  @Delete(':opportunityId')
  @Roles(UserRole.VOLUNTEER, UserRole.ADMIN)
  async deleteOpportunity(@Param() param: any, @Req() req: any,) {
    return this.opportunitiesService.deleteOpportunity(param, req);
  }
}
