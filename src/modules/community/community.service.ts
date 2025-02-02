import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import { deleteFile } from 'src/common';
import { CommunityRepository, SubcategoryRepository } from 'src/models';
import { MessageService } from 'src/utils';

@Injectable()
export class CommunityService {

    constructor(
        private communityRepo: CommunityRepository,
        private subcategoryRepo: SubcategoryRepository,
        private messageService: MessageService
    ) { }

    //create community
    createCommunity = async (body: any, req: any, file: Express.Multer.File) => {
        const { user } = req
        const { name } = body

        //check existence
        const communityExist = await this.communityRepo.findOne({ name })
        if (communityExist) {
            if (file) {
                deleteFile(file?.path)
            }
            throw new ConflictException(this.messageService.messages.community.alreadyExist)
        }

        const subcategoryExist = await this.subcategoryRepo.findById(body.subcategory)
        if (!subcategoryExist) {
            if (file) {
                deleteFile(file?.path)
            }
            throw new NotFoundException(this.messageService.messages.subcategory.notFound)
        }
        //prepare data
        body.location = JSON.parse(body.location)
        body.date = JSON.parse(body.date)
        body.slug = slugify(name)
        body.volunteer = user._id
        body.createdBy = user._id
        body.updatedBy = user._id
        if (file) {
            body.image = file.path
        } else {
            const defaultCommunityIMage = 'uploads\\community\\Community-Avatar.jpg'
            body.image = defaultCommunityIMage
        }

        //save data
        const createdCommunity = await this.communityRepo.create(body)

        // response
        return { success: true, data: body }
    }

    //get all communities of scepific subcategory
    getAllCommunities = async (param: any) => {
        const { subcategoryId } = param

        const subcategoryExist = await this.subcategoryRepo.findById(subcategoryId)
        if (!subcategoryExist) {
            throw new NotFoundException(this.messageService.messages.subcategory.notFound)
        }

        const communityExist = await this.communityRepo.find({ subcategory: subcategoryId })
        if (!communityExist) {
            throw new NotFoundException(this.messageService.messages.community.notFound)
        }

        return { succeess: true, data: communityExist }
    }

    //update community
    updateCommuniuty = async (param: any, req: any, body: any, file: Express.Multer.File) => {
        try {
            const { communityId } = param
            const { user } = req
            const { name, desc, limitOfUsers, roles, location, status, date } = body

            //check existence 
            const communityExist = await this.communityRepo.findById(communityId)
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
                    deleteFile(communityExist.image)
                }
                communityExist.image = file.path
            }

            if (location) {
                communityExist.location = JSON.parse(location)
            }
            if (date) {
                communityExist.date = JSON.parse(date)
            }

            if (limitOfUsers) {
                if (communityExist.members.length > limitOfUsers) {
                    throw new ConflictException('number of members was biger than limit you want')
                }
                communityExist.limitOfUsers = limitOfUsers
            }

            const updateableFields = {
                desc,
                roles,
                status
            }

            for (const [key, value] of Object.entries(updateableFields)) {
                if (value !== undefined) {
                    communityExist[key] = value
                }
            }

            communityExist.updatedBy = user._id

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

    //get specific community 
    getSpecificCommunity = async (param: any, req: any) => {
        const { user } = req
        const { communityId } = param

        const communityExist = await this.communityRepo.findById(communityId)
        if (!communityExist) {
            throw new NotFoundException(this.messageService.messages.community.notFound)
        }

        return { success: true, data: communityExist }
    }

    //delete community 
    deleteCommunity = async (param: any, req: any) => {
        const { communityId } = param
        const { user } = req

        //check existence
        const communityExist = await this.communityRepo.findOneAndDelete({ _id: communityId, createdBy: user._id })
        if (!communityExist) {
            throw new NotFoundException('you are not the owner or the community was now found')
        }
        const defaultCommunityImage = 'uploads\\community\\Community-Avatar.jpg'
        if(communityExist?.image && communityExist.image !== defaultCommunityImage){
            deleteFile(communityExist.image)
        }

        return { success: true }
    }

}
