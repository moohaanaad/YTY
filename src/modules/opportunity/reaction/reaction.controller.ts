import { Body, Controller, Get, Param, Put, Req } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { OpportunityParamDto } from '../dto/opportunityParam.dto';
import { ReactDto } from '../dto/react.dto';

@Controller('reaction')
export class ReactionController {

    constructor(private reactService: ReactionService) { }

    //make react 
    @Put("react/:opportunityId")
    makeReact(@Param() param: OpportunityParamDto, @Req() req: any, @Body() body: ReactDto) {
        return this.reactService.makeReact(param, req, body)
    }

    //get all reacts of specific opportunity 
    @Get("react/:opportunityId")
    getReacts(@Param() param: OpportunityParamDto) {
        return this.reactService.getReacts(param)
    }

}
