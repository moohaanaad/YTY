import { BadRequestException, Body, Controller, Delete, Get, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guard/authentication.guard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { deleteFile, dS, fileValidation, fileValidationTypes } from 'src/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { errorMessages } from 'src/common/errorhandling/prepareErrorMessage';
import { BecomeVolunteerDto } from './dto/becomeVolunteer.dto';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
    constructor(private userSerive: UserService) { }

    //update user
    @Put()
    @UseInterceptors(FileInterceptor('image', {
        storage: dS('uploads/user'),
        fileFilter: fileValidation(fileValidationTypes.image)
    }))
    async updateUser(
        @Body() body: any,
        @Req() req: any,
        @UploadedFile() file: Express.Multer.File
    ) {
        try {

            // Parse nested JSON fields manually
            if (body.address) body.address = JSON.parse(body.address);


            // Convert to DTO
            const dto = plainToInstance(UpdateUserDto, body);

            // Validate DTO manually
            const errors = await validate(dto);

            if (errors.length > 0) {

                throw new BadRequestException(errors);
            }

            // Pass to service
            return this.userSerive.updateUser(dto, req, file);

        } catch (error) {
            if (file) deleteFile(file.path)
            throw new BadRequestException(errorMessages(error));
        }
    }

    //get user
    @Get()
    getUser(@Req() req: any) {
        return this.userSerive.getUser(req)
    }

    //delete user 
    @Delete()
    deleteProfile(@Req() req: any) {
        return this.userSerive.deleteProfile(req)
    }

    //become a volunteer
    @UseInterceptors(
        FileInterceptor('image', {
          storage: dS('uploads/user/volunteer'),
          fileFilter: fileValidation(fileValidationTypes.image)
        }))
    @Put('become-volunteer')
    BecomeVolunteer(@Req() req: any, @Body() body: BecomeVolunteerDto, @UploadedFile() file:Express.Multer.File) {
        return this.userSerive.BecomeVolunteer(req, body, file)
    }
}
