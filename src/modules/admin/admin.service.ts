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
        return await this.userRepo.find().select('-password');
    }

    //get user by id
    getUserById = async (id: string) => {
        const userId = new Types.ObjectId(id);

        const user = await this.userRepo.findById(userId).select('-password');
        if (!user) throw new NotFoundException('User not found');
        return user;

    //chane user role
    }
        changeUserRole = async (id: string, role: string) => {
        const userId = new Types.ObjectId(id);

        const user = await this.userRepo.findByIdAndUpdate(userId, { role }, { new: true });
        if (!user) throw new NotFoundException('User not found');
        return { message: 'User role updated', user };
        }

         //delete user
      deleteUser = async (id: string) => {
        const userId = new Types.ObjectId(id);

        const user = await this.userRepo.findByIdAndDelete(userId);
        if (!user) throw new NotFoundException('User not found');
        return { message: 'User deleted successfully' };
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
        //OPPORTUNITY

    //get all opportunities
    getAllOpportunities = async (query: any) => {
        return this.communityRepo.find();
        }
       
    //DELETE OPPORTUNITY
    
        
    

}
