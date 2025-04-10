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
@UseGuards(AuthGuard)
export class CommunityController {

    constructor(private communityService: CommunityService) { }

    //create community
    @Post()
    @Roles(UserRole.ADMIN, UserRole.VULONTEER)
    @UseGuards(RolesGuard)
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

    //get all communities
    @Get()
    getAllCommunities() {
        return this.communityService.getAllCommunities()
    }

    //get all communities with the same user's interests
    @Get('intersting-community')
    userInterstsCommunities(@Req() req: any) {
        return this.communityService.userInterstsCommunities(req)
    }

    //get all community of specific subcategory
    @Get(':subcategoryId')
    subcategoryCommunities(
        @Param() param: any
    ) {
        return this.communityService.subcategoryCommunities(param)
    }

    //get all communities of specific user
    @Get("/user")
    userCommunities(
        @Req() req: any
    ) {
        return this.communityService.userCommunities(req)
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
}
