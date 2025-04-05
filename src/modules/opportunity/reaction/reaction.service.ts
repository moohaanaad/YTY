import { Injectable, NotFoundException } from '@nestjs/common';
import { opportunityRepository } from 'src/models/opportunity/opportunity.repository';
import { MessageService } from 'src/utils';

@Injectable()
export class ReactionService {

    constructor(
        private opportunityRepo: opportunityRepository,
        private messageService: MessageService
    ) { }

    makeReact = async (param: any, req: any, body: any) => {
        const { postId } = param
        const { user } = req
        const { react } = body

        //check post existence
        let opportunityExist = await this.opportunityRepo.findById(postId)

        if (!opportunityExist) {
            throw new NotFoundException(this.messageService.messages.opportunity.notFound)
        }

        //check react existence
        const reactExist = opportunityExist.react.find((r) => r.user == user._id)

        //checking data
        if (reactExist && reactExist.react == react) {

            opportunityExist.react = opportunityExist.react.filter((r) => r.user != user._id)

        } else if (reactExist) {

            reactExist.react = react

        } else {

            opportunityExist.react.push({ user: user._id, react })

        }

        await opportunityExist.save()
        return { success: true, data: opportunityExist }
    }

    getReacts = async (param: any) => {
        const { opportunityId } = param

        //check existence
        const opportunityExist = await this.opportunityRepo.findById(opportunityId) // populate
        if (!opportunityExist) {
            throw new NotFoundException(this.messageService.messages.opportunity.notFound)
        }
        return { success: true, data: opportunityExist.react }
    }

}

