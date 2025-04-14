import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { deleteFile } from 'src/common';
import { UserRepository } from 'src/models/user/user.repository';
import { MessageService } from 'src/utils';
import { CheckExistService } from './checkExist.service';
import { Gender } from 'src/utils/enums/user.enum';

@Injectable()
export class UserService {
    constructor(
        private userRepo: UserRepository,
        private messageService: MessageService,
        private checkExistService: CheckExistService
    ) { }

    //update user
    updateUser = async (body: any, req: any, file: Express.Multer.File) => {
        const {
            email, userName, phone, firstName, lastName, address, BD, gender,
            bio, education, skill, interested,
        } = body
        const { user } = req

        //check existence
        if (email && email != user?.email) {
            //vreify email 
            user.email = await this.checkExistService.checkAndUpdate(email, this.messageService.messages.user.email, file);
        }

        if (userName && userName != user?.userName) {
            user.userName = await this.checkExistService.checkAndUpdate(userName, this.messageService.messages.user.userName.alreadyExist, file);
        }

        if (phone && phone != user?.phone) {
            user.phone = await this.checkExistService.checkAndUpdate(phone, this.messageService.messages.user.phone, file)
        }

        //check image
        const defaultFemaleProfile = "uploads\\user\\Female Avatar.png"
        const defaultMaleProfile = "uploads\\user\\Male Avatar.png"
        if (file) {
            if (![defaultMaleProfile, defaultFemaleProfile].includes(file.path)) {
                deleteFile(user.profileImage)
            }
            user.profileImage = file.path
        } else {
            if (user.gender == Gender.MALE) {
                user.profileImage = defaultMaleProfile
            } else {
                user.profileImage = defaultFemaleProfile
            }
        }

        if (interested) user.interested = JSON.parse(interested);

        //preapre data
        const updateableFields = {
            firstName,
            lastName,
            address,
            BD,
            gender,
            bio,
            education,
            skill,

        };


        //change data
        for (const [key, value] of Object.entries(updateableFields)) {
            if (value !== undefined) {
                user[key] = value;
            }
        }

        //save changence
        await user.save()

        //response
        return { success: true, data: user }
    }

    //get user
    getUser = (req: any) => {
        const { user } = req
        return { success: true, data: user }

    }

    //delete user profile
    deleteProfile = async (req: any) => {
        const { user } = req
        const defaultFemaleProfile = "uploads\\user\\Female Avatar.png"
        const defaultMaleProfile = "uploads\\user\\Male Avatar.png"
        if (![defaultFemaleProfile, defaultMaleProfile].includes(user.profileImage)) {
            deleteFile(user.profileImage)
        }

        const deletedUser = await this.userRepo.findByIdAndDelete(user._id)
        console.log(user._id);

        if (!deletedUser) {
            return new BadRequestException()
        }
        return { success: true, data: deletedUser }
    }

    //become a volunteer
    BecomeVolunteer = async (req: any, body: any, file: Express.Multer.File) => {
        const { user } = req

        //check existence
        const userExist = await this.userRepo.findById(user._id).select('-password')
        if (!userExist) throw new NotFoundException(this.messageService.messages.user.notFound)
        
        await userExist.save()

        return { success: true, data: userExist}

    }

}
