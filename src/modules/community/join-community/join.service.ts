import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CommunityRepository } from 'src/models';
import { CommunityJoinRequest, CommunityStatus, joinCommunity, MessageService } from 'src/utils';

@Injectable()
export class JoinService {
    constructor(
        private communityRepo: CommunityRepository,
        private messageService: MessageService
    ) { }

    //join community
    joinCommunity = async (param: any, req: any) => {
        const { communityId } = param
        const { user } = req

        //check existence
        const CommunityExist = await this.communityRepo.findById(communityId)
        if (!CommunityExist) {
            throw new NotFoundException(this.messageService.messages.community.notFound)
        }

        // check community limit 
        if (CommunityExist.members.length >= CommunityExist.limitOfUsers) {
            throw new BadRequestException(this.messageService.messages.community.join.communityFull)
        }

        //check if user is join before 
        const existingStatus = user?.communities.find(com => com.community.toString() == CommunityExist._id)

        // check status exist
        if (existingStatus?.status == joinCommunity.REJECTED) {
            throw new BadRequestException(this.messageService.messages.community.join.communityRejected);
        } else if (existingStatus?.status == joinCommunity.JOINED) {
            throw new BadRequestException(this.messageService.messages.community.join.alreadyJoined)

        } else if (existingStatus?.status == joinCommunity.PENDING) {
            throw new BadRequestException(this.messageService.messages.community.join.alreadyRequested)
        }
        
        // check community status 
        if (CommunityExist.status == CommunityStatus.PUBLIC) {
            CommunityExist.members.push(user._id)
            user.communities.push({
                community: CommunityExist._id,
                status: joinCommunity.JOINED
            })
            await CommunityExist.save()
            await user.save()
            return { success: true, message: this.messageService.messages.community.join.joinSuccessfully }
        } else {
            
            CommunityExist.askTOJoin.push(user._id)
            user.communities.push({
                community: CommunityExist._id,
                status: joinCommunity.PENDING
            })
            await CommunityExist.save()
            await user.save()
            return { success: true, message: this.messageService.messages.community.join.requestSent }
        }

    }

    //handle join request
    handleRequest = async (param: any, req: any, body: any) => {
        const { communityId } = param
        const { user } = req

        //check existence 
        const communityExist = await this.communityRepo.findById(communityId)
        if (!communityExist) {
            throw new NotFoundException(this.messageService.messages.community.notFound)
        }

        //find request index
        const requestIndex = communityExist.askTOJoin.findIndex(req => req.toString() == user._id)
        const userCommunityIndex = user.communities.findIndex(com => com.community.toString() == communityExist._id);
        if (requestIndex == -1 || userCommunityIndex == -1) {
            throw new NotFoundException(this.messageService.messages.community.join.notFound)
        }

        //check community space
        if (communityExist.members.length >= communityExist.limitOfUsers) {
            throw new BadRequestException(this.messageService.messages.community.join.communityFull)
        }

        //accept join request 
        if (body.status == CommunityJoinRequest.ACCEPTED) {
            
            communityExist.members.push(user._id)

            user.communities[userCommunityIndex].status = joinCommunity.JOINED
            
        } else {
            
            user.communities[userCommunityIndex].status = joinCommunity.REJECTED
        }

        //delete user from waiting list
        communityExist.askTOJoin.splice(requestIndex, 1)
        
        //save 
        await communityExist.save()
        await user.markModified("communities")// Ensure nested changes are tracked
        await user.save()

        //response
        return {
            success: true,
            members: communityExist.members,
            waiting: communityExist.askTOJoin,
            communityJoined: user.communities
        }
    }

    //cancel join request 
    cancelJoin = async (param: any, req: any) => {
        const { communityId } = param
        const { user } = req

        //check existence 
        const communityExist = await this.communityRepo.findById(communityId)
        if (!communityExist) {
            throw new NotFoundException(this.messageService.messages.community.notFound)
        }

        // Find the user's community request
        const userCommunityIndex = user.communities.findIndex(
            (com) => com.community.toString() == communityId && com.status == joinCommunity.PENDING
        )
        const communityUserIndex = communityExist.askTOJoin.findIndex(
            (member) => member.toString() == user._id
        )
        
        // If no pending request
        if (userCommunityIndex == -1) {
            throw new BadRequestException(this.messageService.messages.community.join.notFound);
        }

        // Remove the pending request
        communityExist.askTOJoin.splice(communityUserIndex, 1)
        user.communities.splice(userCommunityIndex, 1);
        await communityExist.save()
        await user.save();

        //response
        return {
            success: true, message: this.messageService.messages.community.join.joinCanceled
        };
    }

    //leave community 
    leaveCommunity = async (param: any, req: any) => {
        const { communityId } = param
        const { user } = req

        //check existence 
        const communityExist = await this.communityRepo.findById(communityId)
        if(!communityExist) {
            throw new NotFoundException(this.messageService.messages.category.notFound)
        }

        // find the user's community 
        const userCommunityIndex = user.communities.findIndex(
            (com) => com.community.toString() == communityId && com.status == joinCommunity.JOINED
        )
       
        
        const communityUserIndex = communityExist.members.findIndex(
            (member) => member.toString() == user._id
        )
        

        //if user not found
        if(userCommunityIndex == -1) {
            throw new NotFoundException(this.messageService.messages.community.join.joinNotFound)
        }

        //remove user from community
        communityExist.members.splice(communityUserIndex, 1)
        user.communities.splice(userCommunityIndex, 1);
        await communityExist.save()
        await user.save();

        //response
        return {
            success: true, message: this.messageService.messages.community.join.leaveSuccessfully,
            user: user.communities, community: communityExist.members
        }
    }
}
