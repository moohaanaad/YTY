import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req } from '@nestjs/common';
import { OpportunitiesService } from './opportunities.service';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { Roles } from 'src/modules/authorization/roles.decorator';
import { UserRole } from 'src/utils'; 
import { RolesGuard } from 'src/guard/roles.guard';
import { AuthGuard } from 'src/guard/authentication.guard';


@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Post()
  @Roles(UserRole.ADMIN,UserRole.VULONTEER) // Only Volunteers & Admins can create opportunities
  @UseGuards(AuthGuard,RolesGuard)
  async create(@Body() createOpportunityDto: CreateOpportunityDto, @Req() req) {
    return this.opportunitiesService.create(createOpportunityDto, req.user.id);
  }

  @Get()
  async findAll() {
    return this.opportunitiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.opportunitiesService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.VULONTEER, UserRole.ADMIN) // Only the creator can update
  @UseGuards(AuthGuard, RolesGuard)
  async update(@Param('id') id: string, @Body() updateOpportunityDto: UpdateOpportunityDto, @Req() req) {
    return this.opportunitiesService.update(id, updateOpportunityDto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.VULONTEER, UserRole.ADMIN) // Only the creator can delete
  @UseGuards(AuthGuard,RolesGuard)
  async remove(@Param('id') id: string, @Req() req) {
    return this.opportunitiesService.delete(id, req.user.id);
  }
}
