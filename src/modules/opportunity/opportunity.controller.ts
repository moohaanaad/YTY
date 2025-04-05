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


@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) { }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.VULONTEER) // Only Volunteers & Admins can create opportunities
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: dS('uploads/opportunity'),
      fileFilter: fileValidation(fileValidationTypes.image)
    }))
  async createOpportunity(@Body() body: CreateOpportunityDto, @Req() req: any, @UploadedFile() file: Express.Multer.File) {
    return this.opportunitiesService.createOpportunity(body, req, file);
  }

  @Get()
  async getOpportunities() {
    return this.opportunitiesService.getOpportunities();
  }

  @Get(':opportunityId')
  async getSpecificOpportunity(@Param() Param: string) {
    return this.opportunitiesService.getSpecificOpportunity(Param);
  }

  @Put(':opportunityId')
  @Roles(UserRole.VULONTEER, UserRole.ADMIN) // Only the creator can update
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: dS('uploads/opportunity'),
      fileFilter: fileValidation(fileValidationTypes.image)
    }))
  async updateOpportunity(@Param() param: any, @Req() req: any, @Body() body: UpdateOpportunityDto, @UploadedFile() file: Express.Multer.File) {
    return this.opportunitiesService.updateOpportunity(param, req, body, file);
  }

  @Delete(':id')
  @Roles(UserRole.VULONTEER, UserRole.ADMIN) // Only the creator can delete
  @UseGuards(AuthGuard, RolesGuard)
  async deleteOpportunity(@Param() param: any, @Req() req: any,) {
    return this.opportunitiesService.deleteOpportunity(param, req);
  }
}
