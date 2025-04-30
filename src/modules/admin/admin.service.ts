import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { CommunityRepository, User, UserRepository } from 'src/models';
import { Opportunity } from 'src/models/opportunity/opportunity.schema';

import { Types } from 'mongoose';
import { OpportunityRepository } from 'src/models/opportunity/opportunity.repository';
import { ConfirmEmail, MessageService } from 'src/utils';




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

        // check existence and delete 
        const community = await this.communityRepo.findByIdAndDelete(communityId);
        if (!community) throw new NotFoundException('Community not found');

        return { success: true, message: 'Community deleted successfully' };
    }

    //delete empty community
    deleteEmptyCommunity = async (id: string) => {
        const communityId = new Types.ObjectId(id);
        const result = await this.communityRepo.deleteMany({
            _id: communityId, members: { $exists: true, $size: 0 }
        });
        if (!result.deletedCount) 
            throw new NotFoundException('Community not found or not empty');
        return { message: `${result.deletedCount} empty communities deleted` };
    }

    //-----------------OPPORTUNITY-----------------

    //get all opportunities
    getAllOpportunities = async (query: any) => {
        const opportunitiesExist = await this.communityRepo.find();
        if(!opportunitiesExist) throw new NotFoundException(this.messageService.messages.opportunity.notFound)
        return { success: true, data: opportunitiesExist }
    }

    //DELETE OPPORTUNITY
    deleteOpportunity = async (id: string) => {
        const opportunityId = new Types.ObjectId(id);
        const opportunitiesExist = await this.opportunityRepo.findByIdAndDelete(opportunityId);
        if(!opportunitiesExist) throw new NotFoundException(this.messageService.messages.opportunity.notFound)
        return { success: true, message: 'Opportunity deleted successfully' };
    }



}
