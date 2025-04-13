import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guard/authentication.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from '../authorization/roles.decorator';
import { UserRole } from 'src/utils';
import { AdminService } from './admin.service';

@Roles(UserRole.ADMIN)
@UseGuards(AuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
    constructor(
         private adminService:AdminService) {}

    //User
    //get all users
     @Get('users')
        getAllUsers(@Query() query: any) {
            return this.adminService.getAllUsers(query);
            }
    //change user role
    @Patch('users/:id/role')
        changeUserRole(@Param('id') id: string, @Body('role') role: string) {
            return this.adminService.changeUserRole(id, role);
        }
    //delete user
        @Delete('users/:id')
        deleteUser(@Param('id') id: string) {
            return this.adminService.deleteUser(id);
        }

    //Community

    //get all communities that have user in it
    @Get('communities/with-members')
        getCommunitiesWithMembers(@Query() query: any) {
            return this.adminService.getCommunitiesWithMembers(query);
        }
      
    //get community that have no members
    @Get('communities/no-members')
        getCommunitiesWithoutMembers() {
            return this.adminService.getCommunitiesWithoutMembers({});
        } 
        //get all communities
    @Get('communities')
        getAllCommunities(@Query() query: any) {
            return this.adminService.getAllCommunities(query);
        }
    //opportunity
    
    //get all opportunities
    @Get('opportunities')
        getAllOpportunities(@Query() query: any) {
            return this.adminService.getAllOpportunities(query);
        }

        //delete opportunity
    
        
        

    


}

