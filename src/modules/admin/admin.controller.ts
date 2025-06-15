import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from 'src/guard/authentication.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from '../authorization/roles.decorator';
import { UserRole } from 'src/utils';
import { AdminService } from './admin.service';
import { UserService } from '../user/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { dS, fileValidation, fileValidationTypes } from 'src/common';
import { CreateAdminDto } from './dto/create-admin.dto';

@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
    constructor(
        private adminService: AdminService,
        private readonly userService: UserService) { }

    //-----------------USER-----------------

    //get all users
    @Get('user')
    getAllUsers() {
        return this.adminService.getAllUsers();
    }

    //get specific user
    @Get('user/:userId')
    getSpecificUser(@Param() param: any) {
        return this.adminService.getSpecificUser(param);
    }

    //change user role
    @Patch('user/role/:id')
    changeUserRole(@Param('id') id: string, @Body('role') role: string) {
        return this.adminService.changeUserRole(id, role);
    }

    //delete user
    @Delete('user/:id')
    deleteUser(@Param('id') id: string) {
        return this.adminService.deleteUser(id);
    }

    //delete fake users
    @Delete('users/unverified')
    deleteunverifiedUser() {
        return this.adminService.deleteUnverifiedUser();
    }


    //-----------------COMMUNITY-----------------

    //get all communities that have user in it
    @Get('community/with-members')
    getCommunitiesWithMembers() {
        return this.adminService.getCommunitiesWithMembers();
    }

    //get all communities that have no user in it
    @Get('community/no-members')
    getCommunitiesWithoutMembers() {
        return this.adminService.getCommunitiesWithoutMembers();
    }

    //get all communities
    @Get('community')
    getAllCommunities(@Query() query: any) {
        return this.adminService.getAllCommunities(query);
    }

    //delete specific community
    @Delete('community/:id')
    deleteCommunity(@Param('id') id: string) {
        return this.adminService.deleteCommunity(id);
    }

    //delete all empty communities
    @Delete('community')
    deleteEmptyCommunity() {
        return this.adminService.deleteEmptyCommunity();
    }

    //update community 
    @Put('community/:communityId')
    @UseInterceptors(FileInterceptor('image', {
        storage: dS('uploads/community'),
        fileFilter: fileValidation(fileValidationTypes.image)
    }))
    updateCommunity(@Param() param: any, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
        return this.adminService.updateCommuniuty(param, body, file)
    }

    @Put('community/remove-member/:communityId')
    removeMember(@Param() param: any, @Body() body: any) {
        return this.adminService.removeMember(param, body)
    }


    //-----------------OPPORTUNITY-----------------

    //get all opportunities
    @Get('opportunity')
    getAllOpportunities() {
        return this.adminService.getAllOpportunities();
    }

    //delete opportunity
    @Delete('opportunity/:id')
    deleteOpportunity(@Param('id') id: string) {
        return this.adminService.deleteOpportunity(id);
    }

    //update opportunity
    @Put('opportunity/:opportunityId')
    @UseInterceptors(FileInterceptor('image', {
        storage: dS('uploads/community'),
        fileFilter: fileValidation(fileValidationTypes.image)
    }))
    updateOpportunity(@Param() param: any, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
        return this.adminService.updateOpportunity(param, body, file)
    }

    //----------------Become volunteer-----------------
    
    //accept volunteer
    @Patch('users/:id/accept-volunteer')
    acceptVolunteerRequest(@Param('id') userId: string) {
        return this.adminService.acceptVolunteerRequest(userId);
    }
    //reject volunteer
    @Patch('users/:id/reject-volunteer')
    rejectVolunteerRequest(@Param('id') userId: string) {
        return this.adminService.rejectVolunteerRequest(userId);
    }
    //--------------------------------------DASHBOARD------------------------------------//
    // get satas 

    @Get('stats')
    getStats() {
        return this.adminService.getAllStats();
    }

    // TOP 5 Communities

    @Get ('stats/topCommunities')
    async getTopCommunities() {
        return this.adminService.topCommunities();
    }

    // ROLRS PI 

    @Get ('stats/rolespi')
    async getRolesStats() {
        return this.adminService.getRolesStats();
    }

    // USER GROTH 

    @Get('stats/usergrowth')
    async getUserGrowth() {
    return this.adminService.getUserGrowth();
    }

    // RECENT VOLUNTEER REQUESTES

    @Get('recent-volunteer-requests')//doesnt work yet

    async getRecentVolunteerRequests(@Query('limit') limit = 5) {
    return this.adminService.getRecentVolunteerRequests();
}

//recent categories
    @Get('recent-categories')
    async getRecentCategories(@Query('limit') limit = 10) {
    return this.adminService.getRecentCategories(+limit);
}

//----------------Become volunteer-----------------

//create admin 
@Post()
createAdmin(@Body() body: CreateAdminDto){
    return this.adminService.createAdmin(body)
}

}


