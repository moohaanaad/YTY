import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CommunityService } from './community.service';
import { AuthGuard } from 'src/guard/authentication.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { dS, fileValidation, fileValidationTypes } from 'src/common';
import { CreateCommunityDto } from './dto/createCommunty.dto';

@Controller('community')
@UseGuards(AuthGuard)
export class CommunityController {

    constructor(private communityService: CommunityService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image', {
        storage: dS('uploads/community'),
        fileFilter: fileValidation(fileValidationTypes.image)
    }))
    createCommunity(@Body() body: any, @Req() req: any, @UploadedFile() file: Express.Multer.File) {
        
        return this.communityService.createCommunity(body, req, file)
    }

    //get all community of specific subcategory
    @Get(':subcategoryId')
    getAllCommunities(@Param() param: any) {
        return this.communityService.getAllCommunities(param)
    }

    //get specific community
    @Get('specific/:communityId')
    getSpecificCommunity(@Param() param:any, @Req() req: any) {
        return this.communityService.getSpecificCommunity(param, req)
    }   

    //delete community
    @Delete(':communityId')
    deleteCommunity(@Param() param:any, @Req() req: any) {
        return this.communityService.deleteCommunity(param, req)
    }   

    //update community 
    @Put(':communityId')
    @UseInterceptors(FileInterceptor('image', {
        storage: dS('uploads/community'),
        fileFilter: fileValidation(fileValidationTypes.image)
    }))
    updateCommunity(
        @Param() param: any, @Req() req: any,
        @Body() body: any, @UploadedFile() file: Express.Multer.File
    ) {
        return this.communityService.updateCommuniuty(param, req, body, file)
    }
}
