import { BadRequestException, ConflictException, Injectable, NotFoundException, Param } from '@nestjs/common';
import { CommunityRepository, User, UserRepository } from 'src/models';
import { Opportunity } from 'src/models/opportunity/opportunity.schema';

import { Types } from 'mongoose';
import { OpportunityRepository } from 'src/models/opportunity/opportunity.repository';
import { ConfirmEmail, ConfirmVolunteerRequist, MessageService } from 'src/utils';
import { deleteFile } from 'src/common';
import slugify from 'slugify';




@Injectable()
export class AdminService {
    constructor(
        private userRepo: UserRepository,
        private communityRepo: CommunityRepository,
        private messageService: MessageService,
        private opportunityRepo: OpportunityRepository,
    ) { }

    //-----------------USER-----------------

    //all users
    getAllUsers = async () => {

        const users = await this.userRepo.find().select('-password').populate('communities', 'name');
        if (!users) throw new NotFoundException('No users found');

        return { success: true, data: users };

    }

    //get specific user 
    getSpecificUser = async (params: any) => {
        const { userId } = params

        const users = await this.userRepo.findById(userId).select('-password');
        if (!users) throw new NotFoundException('User not found');
        return { success: true, data: users };


    }

    //change user's role
    changeUserRole = async (id: string, roles: string) => {
        const userId = new Types.ObjectId(id);

        //check existence and change user's role
        const user = await this.userRepo.findByIdAndUpdate(userId, { roles }, { new: true });
        if (!user) throw new NotFoundException('User not found');

        //response
        return { succes: true, message: 'User role updated', user };
    }

    //delete user
    deleteUser = async (id: string) => {
        const userId = new Types.ObjectId(id);

        //check existence and delete user
        const user = await this.userRepo.findByIdAndDelete(userId);
        if (!user) throw new NotFoundException('User not found');

        //remove user from all communities he was used
        await this.communityRepo.updateMany({ members: userId }, { $pull: { members: userId } });

        //response
        return { success: true, message: 'User deleted and removed from communities successfully' };

    }

    //delete fake users
    deleteUnverifiedUser = async () => {

        let expiredUsersId = []

        //check if user was pending more than month 
        const expiredUsers = await this.userRepo.find({
            confirmEmail: ConfirmEmail.PENDING,
            createdAt: { $lte: (Date.now() - 30 * 24 * 60 * 60 * 1000) }
        })
        if (!expiredUsers) throw new NotFoundException('No unverified users found');

        //prepare users id
        for (let i = 0; i < expiredUsers.length; i++) {
            expiredUsersId.push(expiredUsers[i]._id);
        }

        //delete users 
        const deletedUsers = await this.userRepo.deleteMany({ _id: { $in: expiredUsersId } })

        //response
        return { message: `${deletedUsers.deletedCount} unverified users deleted` };
    }




    //-----------------COMMUNITY-----------------

    //get all communities that  have user in it
    getCommunitiesWithMembers = async () => {
        const communitiesExist = await this.communityRepo.find({
            members: { $exists: true, $not: { $size: 0 } }
        });
        if (!communitiesExist) throw new NotFoundException(this.messageService.messages.community.notFound)

        return { success: true, data: communitiesExist }
    }

    //get all communities that have no user in it
    getCommunitiesWithoutMembers = async () => {
        const communitiesExist = await this.communityRepo.find({
            members: { $exists: true, $size: 0 }
        });
        if (!communitiesExist) throw new NotFoundException(this.messageService.messages.community.notFound)
        return { success: true, data: communitiesExist }
    }

    //get all communities
    getAllCommunities = async (query: any) => {
        const communitiesExist = await this.communityRepo.find();
        if (!communitiesExist) throw new NotFoundException(this.messageService.messages.community.notFound)
        return { success: true, data: communitiesExist }
    }

    //delete community
    deleteCommunity = async (id: string) => {
        const communityId = new Types.ObjectId(id);


        //remove community from all users that was used
        await this.userRepo.updateMany({ communities: communityId }, { $pull: { communities: communityId } });

        // check existence and delete 
        const community = await this.communityRepo.findByIdAndDelete(communityId);

        if (!community) throw new NotFoundException('Community not found');

        return { success: true, message: 'Community deleted successfully' };
    }

    //delete empty community
    deleteEmptyCommunity = async () => {

        const fifteenDaysAgo = new Date();
        fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);

        //find empty communities first
        const emptyCommunities = await this.communityRepo.find({
            members: { $exists: true, $size: 0 },
            createdAt: { $lte: fifteenDaysAgo }
        });

        if (!emptyCommunities || emptyCommunities.length === 0) {
            throw new NotFoundException('No empty communities found');
        }

        //gets their IDs
        const emptyIds = emptyCommunities.map(c => c._id);

        //remove these community IDs from users
        await this.userRepo.updateMany({ communities: { $in: emptyIds } }, { $pull: { communities: { $in: emptyIds } } }
        );

        //delete the communities
        const result = await this.communityRepo.deleteMany({ _id: { $in: emptyIds } });

        return {
            success: true, message: `${result.deletedCount} empty communities deleted`, deletedCommunityIds: emptyIds,
        };
    };

    updateCommuniuty = async (param: any, body: any, file: Express.Multer.File) => {
        try {
            const { communityId } = param
            let { name, desc, limitOfUsers, roles, location, status, date, types } = body

            //check existence 
            const communityExist = await this.communityRepo.findById(communityId).populate({
                path: 'category',
                select: "name image slug -_id"
            }).populate({
                path: 'subcategory',
                select: "name image slug -_id"
            })
            if (!communityExist) {
                if (file) {
                    deleteFile(file?.path)
                }
                throw new NotFoundException(this.messageService.messages.community.notFound)
            }

            //prepare data
            if (name && name !== communityExist.name) {
                const nameExist = await this.communityRepo.findOne({ name })
                if (nameExist) {
                    if (file) {
                        deleteFile(file?.path)
                    }
                    throw new ConflictException(this.messageService.messages.community.alreadyExist)
                }
                communityExist.name = name
                communityExist.slug = slugify(name)
            }

            if (file) {
                const defaultCommunityIMage = 'uploads\\community\\Community-Avatar.jpg'
                if (communityExist?.image && communityExist.image !== defaultCommunityIMage) {
                    // deleteFile(communityExist?.image)
                }
                communityExist.image = file.path
            }

            if (limitOfUsers) {
                if (communityExist.members.length > limitOfUsers) {
                    throw new ConflictException('number of members was biger than limit you want')
                }
                communityExist.limitOfUsers = limitOfUsers
            }

            if (types) communityExist.types = JSON.parse(types);

            if (body?.location) location = JSON.parse(body.location);
            if (body?.date) date = JSON.parse(body.date);

            const updateableFields = {
                desc,
                roles,
                status,
                location,
                date,
            }

            for (const [key, value] of Object.entries(updateableFields)) {
                if (value !== undefined) {
                    communityExist[key] = value
                }
            }

            //save data
            await communityExist.save()

            //response
            return { success: true, data: communityExist }

        } catch (error) {
            if (file) {
                deleteFile(file.path)
            }

            throw new BadRequestException(error)
        }

    }

    //remove member from community
    removeMember = async (param: any, body: any) => {
        const { communityId } = param
        const { userId } = body

        //check eixstince 
        const communityExist = await this.communityRepo.findById(communityId)
        if (!communityExist) throw new NotFoundException(this.messageService.messages.community.notFound)

        //remove member
        communityExist.members = communityExist.members.filter((member) => member.toString() != userId)

        //save cahnge
        communityExist.save()

        //response
        return { success: true, data: communityExist.members }
    }

    //-----------------OPPORTUNITY-----------------

    //get all opportunities
    getAllOpportunities = async () => {
        const opportunitiesExist = await this.opportunityRepo.find();
        if (!opportunitiesExist) throw new NotFoundException(this.messageService.messages.opportunity.notFound)
        return { success: true, data: opportunitiesExist }
    }

    //DELETE OPPORTUNITY
    deleteOpportunity = async (id: string) => {
        const opportunityId = new Types.ObjectId(id);
        const opportunitiesExist = await this.opportunityRepo.findByIdAndDelete(opportunityId);
        if (!opportunitiesExist) throw new NotFoundException(this.messageService.messages.opportunity.notFound)
        return { success: true, message: 'Opportunity deleted successfully' };
    }

    //update opportunity
    async updateOpportunity(param: any, body: any, file: Express.Multer.File) {
        const { opportunityId } = param
        const { title, slug, description, deadline } = body

        //check existence
        const opportunityExist = await this.opportunityRepo.findById(opportunityId);
        if (!opportunityExist) {
            if (file) {
                deleteFile(file.path)
            }
            throw new NotFoundException(this.messageService.messages.opportunity.notFound);
        }

        if (file) {
            //delete old image
            deleteFile(opportunityExist?.image)

            // update new image 
            opportunityExist.image = file.path
        }

        //prepare data
        const updateableFields = {
            title,
            slug,
            description,
            deadline,
        }

        //change data 
        for (const [key, value] of Object.entries(updateableFields)) {
            if (value !== undefined) {
                opportunityExist[key] = value
            }
        }
        //save data
        await opportunityExist.save()

        //response
        return { success: true, data: opportunityExist }
    }

    //-----------------VOLUNTEER-----------------

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
            success: true, message: 'User volunteer request rejected', data: user
        };
    };

}
