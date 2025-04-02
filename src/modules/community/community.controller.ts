import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { deleteFile, dS, errorMessages, fileValidation, fileValidationTypes } from "src/common";
import { AuthGuard } from "src/guard/authentication.guard";
import { CommunityService } from "./community.service";
import { CreateCommunityDto } from "./dto/createCommunty.dto";
import { UpdateCommuntyDto } from "./dto/updateCommunity.dto";
import { RolesGuard } from "src/guard/roles.guard";
import { Roles } from "../authorization/roles.decorator";
import { UserRole } from "src/utils";





@Controller('community')


export class CommunityController {

    constructor(private communityService: CommunityService) { }

    //create community
    @Post()
    @UseGuards(RolesGuard,AuthGuard)
    @Roles(UserRole.ADMIN,UserRole.VULONTEER)
    @UseInterceptors(FileInterceptor('image', {
        storage: dS('uploads/community'),
        fileFilter: fileValidation(fileValidationTypes.image)
    }))
    async createCommunity(
        @Body() body: any,
        @Req() req: any,
        @UploadedFile() file: Express.Multer.File
    ) {
        try {

            // Parse nested JSON fields manually
            if (body.location) body.location = JSON.parse(body.location);
            if (body.date) body.date = JSON.parse(body.date);
            if (body.schedule) body.schedule = JSON.parse(body.schedule);

            // Convert to DTO
            const dto = plainToInstance(CreateCommunityDto, body);

            // Validate DTO manually
            const errors = await validate(dto);

            if (errors.length > 0) {

                throw new BadRequestException(errors);
            }

            // Pass to service
            return this.communityService.createCommunity(dto, req, file);

        } catch (error) {
            if (file) deleteFile(file.path)
            throw new BadRequestException(errorMessages(error));
        }
    }
    //get all community of specific subcategory
    @Get(':subcategoryId')
    getAllCommunities(
        @Param() param: any
    ) {
        return this.communityService.getAllCommunities(param)
    }

    //get specific community
    @Get('specific/:communityId')
    getSpecificCommunity(
        @Param() param: any,
        @Req() req: any
    ) {
        return this.communityService.getSpecificCommunity(param, req)
    }

    //delete community
    @Delete(':communityId')
    deleteCommunity(
        @Param() param: any,
        @Req() req: any
    ) {
        return this.communityService.deleteCommunity(param, req)
    }

    //update community 
    @Put(':communityId')
    @UseInterceptors(FileInterceptor('image', {
        storage: dS('uploads/community'),
        fileFilter: fileValidation(fileValidationTypes.image)
    }))
    async updateCommunity(
        @Param() param: any,
        @Req() req: any,
        @Body() body: any,
        @UploadedFile() file: Express.Multer.File
    ) {
        try {

            // Parse nested JSON fields manually
            if (body.location) body.location = JSON.parse(body.location);
            if (body.date) body.date = JSON.parse(body.date);
            if (body.schedule) body.schedule = JSON.parse(body.schedule);

            // Convert to DTO
            const dto = plainToInstance(UpdateCommuntyDto, body);

            // Validate DTO manually
            const errors = await validate(dto);

            if (errors.length > 0) {

                throw new BadRequestException(errors);
            }

            // Pass to service
            return this.communityService.updateCommuniuty(param, req, dto, file);

        } catch (error) {
            if (file) deleteFile(file.path)
            throw new BadRequestException(errorMessages(error));
        }
    }

    
}
