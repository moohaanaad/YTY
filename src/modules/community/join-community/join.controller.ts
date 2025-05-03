import { Body, Controller, Param, Put, Req, UseGuards } from '@nestjs/common';
import { JoinService } from './join.service';
import { CommunityParamDto } from '../dto/communityParam.dto';
import { AuthGuard } from 'src/guard/authentication.guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles, ROLES_KEY } from 'src/modules/authorization/roles.decorator';
import { UserRole } from 'src/utils';

@Controller('community')
@UseGuards(AuthGuard, RolesGuard)
export class JoinController {
    constructor(private joinService: JoinService) { }

    //join community request 
    @Put('join-request/:communityId')
    jointCommunity(
        @Param() param: any,
        @Req() req: any,
    ) {
        return this.joinService.joinCommunity(param, req)
    }

    //handle join community request
    @Roles(UserRole.VOLUNTEER)
    @Put('handle-request/:communityId')
    handleRequest(
        @Param() param: any,
        @Req() req: any,
        @Body() body: any
    ) {
        return this.joinService.handleRequest(param, req, body)
    }

    //cancel join request 
    @Put('cancel-join/:communityId')
    cancelJoin(
        @Param() param: CommunityParamDto,
        @Req() req: any
    ) { 
        return this.joinService.cancelJoin(param, req)
    }

    //leave join request 
    @Put('leave-community/:communityId')
    leaveCommunity(
        @Param() param: CommunityParamDto,
        @Req() req: any
    ) { 
        return this.joinService.leaveCommunity(param, req)
    }
}
