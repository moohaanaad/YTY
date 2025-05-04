import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { deleteFile } from 'src/common';
import { UserRepository } from 'src/models/user/user.repository';
import { MessageService } from 'src/utils';
import { CheckExistService } from './checkExist.service';
import { ConfirmVolunteerRequist, Gender } from 'src/utils/enums/user.enum';
import { Types } from 'mongoose';

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
        if (userName && userName != user?.userName) {
            user.userName = await this.checkExistService.checkAndUpdate("username",userName, this.messageService.messages.user.userName.alreadyExist, file);
        }

        if (phone && phone != user?.phone) {
            user.phone = await this.checkExistService.checkAndUpdate("phone",phone, this.messageService.messages.user.phone, file)
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

    //accept volunteer request

    acceptVolunteerRequest = async (userId: string) => {
        //check if userId is provided
        if (!userId) {
          throw new BadRequestException('User ID is required');
        }
        //convert userId to ObjectId

         if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid User ID format');
          }
        const objectId = new Types.ObjectId(userId);
        

        const user = await this.userRepo.findById(objectId);
        //check existence
        if (!user) throw new NotFoundException('User not found');
        
        //check if user req before
        if (user.vulonteerReqStatus !== ConfirmVolunteerRequist.PENDING) {
          throw new BadRequestException('User does not have a pending volunteer request');
        }

        //make user volunteer

        user.vulonteerReqStatus = ConfirmVolunteerRequist.VERIFIED;
        user.roles = 'volunteer'; 
        //save data
        await user.save();

        //response

        return { success: true, message: 'User accepted as volunteer', data: user };
      };

      //reject volunteer request

      rejectVolunteerRequest = async (userId: string) => {
        
        //check if userId is provided

        if (!userId) {
            throw new BadRequestException('User ID is required');
          }
        //convert userId to ObjectId

          const objectId = new Types.ObjectId(userId);
            
        const user = await this.userRepo.findById(objectId);
        //check existence
        
        if (!user) throw new NotFoundException('User not found');
        
        //check if user req before

        if (user.vulonteerReqStatus !== ConfirmVolunteerRequist.PENDING) {
          throw new BadRequestException('User does not have a pending volunteer request');
        }
        //reject user to be volunteer

        user.vulonteerReqStatus = ConfirmVolunteerRequist.REJECTED;
        //save data

        await user.save();
        //response

        return {
          success: true,message: 'User volunteer request rejected',data: user
        };
      };
      
      

}
