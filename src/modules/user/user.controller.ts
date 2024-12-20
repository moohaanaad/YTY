import { Body, Controller, Put, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guard/authentication.guard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { dS, fileValidation, fileValidationTypes } from 'src/common';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
    constructor(private userSerive: UserService) { }

    @Put()
    @UseInterceptors(FileInterceptor('image', {
        storage: dS('uploads/user'),
        fileFilter: fileValidation(fileValidationTypes.image)
    }))
    updateUser(@Body() body: UpdateUserDto, @Req() req: any, file: Express.Multer.File) {
        return this.userSerive.updateUser(body, req, file)
    }
}
