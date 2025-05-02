import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guard/authentication.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from '../authorization/roles.decorator';
import { UserRole } from 'src/utils';
import { AdminService } from './admin.service';

@UseGuards(AuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
    constructor(
        private adminService: AdminService) { }

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
    @Patch('user/:id/role')
    changeUserRole(@Param('id') id: string, @Body('role') role: string) {
        return this.adminService.changeUserRole(id, role);
    }

    //delete user
    @Delete('user/:id')
    deleteUser(@Param('id') id: string) {
        return this.adminService.deleteUser(id);
    }

    //delete fake user
    @Delete('users/unverified')
    deleteunverifiedUser() {
        return this.adminService.deleteUnverifiedUser();
    }


    //-----------------COMMUNITY-----------------

    //get all communities that have user in it
    @Get('communities/with-members')
    getCommunitiesWithMembers() {
        return this.adminService.getCommunitiesWithMembers();
    }

    //get community that have no members
    @Get('communities/no-members')
    getCommunitiesWithoutMembers() {
        return this.adminService.getCommunitiesWithoutMembers();
    }

    //get all communities
    @Get('communities')
    getAllCommunities(@Query() query: any) {
        return this.adminService.getAllCommunities(query);
    }

    //delete community
    @Delete('communities/:id')
    deleteCommunity(@Param('id') id: string) {
        return this.adminService.deleteCommunity(id);
    }

    //delete empty community
    @Delete('communities/empty/:id')
    deleteEmptyCommunity(@Param('id') id: string) {
        return this.adminService.deleteEmptyCommunity();
    }


    //-----------------OPPORTUNITY-----------------

    //get all opportunities
    @Get('opportunities')
    getAllOpportunities(@Query() query: any) {
        return this.adminService.getAllOpportunities(query);
    }

    //delete opportunity
    @Delete('opportunities/:id')
    deleteOpportunity(@Param('id') id: string) {
        return this.adminService.deleteOpportunity(id);
    }
}

