import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { deleteFile } from 'src/common';
import { UserRepository } from 'src/models/user/user.repository';
import { MessageService } from 'src/utils';
import { CheckExistService } from './checkExist.service';
import { ConfirmVolunteerRequist, Gender } from 'src/utils/enums/user.enum';

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
        

        if (!deletedUser) {
            return new BadRequestException()
        }
        return { success: true, data: deletedUser }
    }

    //become a volunteer
    BecomeVolunteer = async (req: any, body: any, files: { frontIdCardImage?: Express.Multer.File, backIdCardImage?: Express.Multer.File }) => {
        try {
            const { user } = req
            let { education, skills, IDImages } = body

            //check if user req before
            if(user.vulonteerReqStatus == ConfirmVolunteerRequist.PENDING){
                if(IDImages){
                    deleteFile(IDImages.frontIdCardImage)
                    deleteFile(IDImages.backIdCardImage)
                }
                return { message: 'you are already make requist to be volunteer please wait admins approve'}
            }
            if(user.vulonteerReqStatus == ConfirmVolunteerRequist.REJECTED){
                if(IDImages){
                    deleteFile(IDImages.frontIdCardImage)
                    deleteFile(IDImages.backIdCardImage)
                }
                return { message: 'you are rejected'}
            }


            //parse data
            skills = JSON.parse(skills);

            //repare data
            const updateableFields = {
                IDImages,
                skills,
                education,

            };


            //change data
            for (const [key, value] of Object.entries(updateableFields)) {
                if (value !== undefined) {
                    user[key] = value;
                }
            }
            user.vulonteerReqStatus = ConfirmVolunteerRequist.PENDING

            //save data
            await user.save()

            //response
            return { success: true, data: user }

        } catch (error) {
            deleteFile(body.IDImages.frontIdCardImage)
            deleteFile(body.IDImages.backIdCardImage)
            throw new BadRequestException(error)
        }
    }

}
