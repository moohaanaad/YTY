import { Injectable, NotFoundException, Param } from '@nestjs/common';
import { CommunityRepository, User, UserRepository} from 'src/models';
import { Opportunity } from 'src/models/opportunity/opportunity.schema';

import { Types } from 'mongoose';
import { OpportunityRepository } from 'src/models/opportunity/opportunity.repository';
import { MessageService } from 'src/utils';




@Injectable()
export class AdminService {
    constructor(
        private userRepo:UserRepository,
        private communityRepo:CommunityRepository,
        private messageService: MessageService,
        private opportunityRepo: OpportunityRepository,
    ){}
      
    //User
    
    //all users
    getAllUsers = async (query: any) => {

        const users = await this.userRepo.find().select('-password').populate('communities', 'name');
        if (!users) throw new NotFoundException('No users found');

        return { success: true, data: users };

    }

    //get user by id
    getUserById = async (id: string) => {
        const userId = new Types.ObjectId(id);

        const users = await this.userRepo.findById(userId).select('-password');
        if (!users) throw new NotFoundException('User not found');
        return { success: true, data: users };

    //chane user role
    }
        changeUserRole = async (id: string, roles: string) => {
        const userId = new Types.ObjectId(id);

        const user = await this.userRepo.findByIdAndUpdate(userId, { roles }, { new: true });
        if (!user) throw new NotFoundException('User not found');
        return { message: 'User role updated', user };
        }

         //delete user
      deleteUser = async (id: string) => {
        const userId = new Types.ObjectId(id);
        const user = await this.userRepo.findByIdAndDelete(userId);
        if (!user) throw new NotFoundException('User not found');
        await this.communityRepo.updateMany({ members: userId }, { $pull: { members: userId } });
        return { message: 'User deleted and removed from communities successfully' };
        }
        //delete fake user
        deleteunverifiedUser = async () => {
            const users = await this.userRepo.deleteMany({ confirmEmail: 'PENDING' });
            if (!users) throw new NotFoundException('No unverified users found');
            return { message: `${users.deletedCount} unverified users deleted` };
        }

    //Community

    //get all communities that  have user in it
    getCommunitiesWithMembers = async (query: any) => {
        return this.communityRepo.find({ members: { $exists: true, $not: { $size: 0 } } });
        }
    //get all communities that have no user in it
    getCommunitiesWithoutMembers = async (query: any) => {
        return this.communityRepo.find({ members: { $exists: true, $size: 0 } });
        }
    //get all communities
    getAllCommunities = async (query: any) => {
        return this.communityRepo.find();
        }
        //delete community
        deleteCommunity = async (id: string) => {
            const communityId = new Types.ObjectId(id);
            const community = await this.communityRepo.findByIdAndDelete(communityId);
            if (!community) throw new NotFoundException('Community not found');
            return { message: 'Community deleted successfully' };
        }
        //delete empty community
        deleteEmptyCommunity = async (id: string) => {
            const communityId = new Types.ObjectId(id);
            const result = await this.communityRepo.deleteMany({ _id: communityId, members: { $exists: true, $size: 0 } });
            if (!result.deletedCount) throw new NotFoundException('Community not found or not empty');
            return { message: `${result.deletedCount} empty communities deleted`};      
        }

        //OPPORTUNITY

    //get all opportunities
    getAllOpportunities = async (query: any) => {
        return this.communityRepo.find();
        }
       
    //DELETE OPPORTUNITY
        deleteOpportunity = async (id: string) => {
            const opportunityId = new Types.ObjectId(id);
            const opportunity = await this.opportunityRepo.findByIdAndDelete(opportunityId);
            if (!opportunity) throw new NotFoundException('Opportunity not found');
            return { message: 'Opportunity deleted successfully' };
        }
        
    

}
