import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common"
import slugify from "slugify"
import { deleteFile } from "src/common"
import { CommunityRepository, SubcategoryRepository } from "src/models"
import { joinCommunity, MessageService } from "src/utils"


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
        const communityExist = await this.communityRepo.findOne({ name }).populate({
            path: 'category',
            select: "name image slug -_id"
        }).populate({
            path: 'subcategory',
            select: "name image slug -_id"
        })
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
        if (body.types) body.types = JSON.parse(body.types);
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

    //update community
    updateCommuniuty = async (param: any, req: any, body: any, file: Express.Multer.File) => {
        try {
            const { communityId } = param
            const { user } = req
            const { name, desc, limitOfUsers, roles, location, status, date, types } = body

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

            const updateableFields = {
                desc,
                roles,
                status,
                location,
                date
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

    //get all communities
    getAllCommunities = async () => {

        const communityExist = await this.communityRepo.find().populate({
            path: 'category',
            select: "name image slug"
        }).populate({
            path: 'subcategory',
            select: "name image slug"
        }).populate({
            path: 'volunteer',
            select: "firstName lastName userName email BD roles address phone gender bio interested education skills profileImage"
        }).populate({
            path: 'askTOJoin',
            select: "firstName lastName userName email BD roles address phone gender bio interested education skills profileImage"
        })
        if (!communityExist) {
            return { message: this.messageService.messages.community.empty }
        }
        return { success: true, data: communityExist }
    }

    //get all communities with the same user's interests
    userInterstsCommunities = async (req: any) => {
        const { user } = req

        //check user's interests
        if (!user?.interested) {
            throw new NotFoundException("you do not have any interests")
        }


        //get community with same interests
        const communitiesExist = await this.communityRepo.aggregate(user.interested)
        if (!communitiesExist) {
            throw new NotFoundException(this.messageService.messages.community.empty)
        }

        //response
        return { success: true, data: communitiesExist }
    }

    //get all communities of scepific subcategory
    subcategoryCommunities = async (param: any) => {
        const { subcategoryId } = param

        const subcategoryExist = await this.subcategoryRepo.findById(subcategoryId)
        if (!subcategoryExist) {
            throw new NotFoundException(this.messageService.messages.subcategory.notFound)
        }

        const communityExist = await this.communityRepo.find({ subcategory: subcategoryId }).populate({
            path: 'category',
            select: "name image slug"
        }).populate({
            path: 'subcategory',
            select: "name image slug"
        }).populate({
            path: 'volunteer',
            select: "firstName lastName userName profileImage"
        }).populate({
            path: 'askTOJoin',
            select: "firstName lastName userName email BD roles address phone gender bio interested education skills profileImage"
        })
        if (!communityExist) {
            throw new NotFoundException(this.messageService.messages.community.notFound)
        }

        return { succeess: true, data: communityExist }
    }

    //get all communities of specific volunteer
    volunteerCommunities = async (req: any) => {
        const { user } = req

        //check existence
        const communitiesExist = await this.communityRepo.find({ createdBy: user._id }).populate({
            path: 'category',
            select: "name image slug"
        }).populate({
            path: 'subcategory',
            select: "name image slug"
        }).populate({
            path: 'volunteer',
            select: "firstName lastName userName email BD roles address phone gender bio interested education skills profileImage"
        }).populate({
            path: 'askTOJoin',
            select: "firstName lastName userName email BD roles address phone gender bio interested education skills profileImage"
        }).populate({
            path: 'members',
            select: "firstName lastName userName email BD roles address phone gender bio interested education skills profileImage"
        })
        if (!communitiesExist) {
            throw new NotFoundException(this.messageService.messages.community.empty)
        }

        //response
        return { success: true, data: communitiesExist }
    }

    //get all communities of specific user
    userCommunities = async (req: any) => {
        const { user } = req
        let userCommunitiesId = []
        for (let i = 0; i < user.communities.length; i++) {
            if (user.communities[i].status == joinCommunity.JOINED) {
                userCommunitiesId.push(user.communities[i].community)
            }

        }
        console.log(userCommunitiesId);

        //check existence
        const communitiesExist = await this.communityRepo.find({ _id: { $in: userCommunitiesId } }).populate({
            path: 'category',
            select: "name image slug"
        }).populate({
            path: 'subcategory',
            select: "name image slug"
        }).populate({
            path: 'volunteer',
            select: "firstName lastName userName email BD roles address phone gender bio interested education skills profileImage"
        }).populate({
            path: 'members',
            select: "firstName lastName userName email BD roles address phone gender bio interested education skills profileImage"
        })

        if (!communitiesExist) {
            throw new NotFoundException(this.messageService.messages.community.empty)
        }

        //response
        return { success: true, data: communitiesExist }
    }

    //get specific community 
    getSpecificCommunity = async (param: any, req: any) => {
        const { user } = req
        const { communityId } = param

        const communityExist = await this.communityRepo.findById(communityId).populate({
            path: 'category',
            select: "name image slug"
        }).populate({
            path: 'subcategory',
            select: "name image slug"
        }).populate({
            path: 'volunteer',
            select: "firstName lastName userName email BD roles address phone gender bio interested education skills profileImage"
        }).populate({
            path: 'askTOJoin',
            select: "firstName lastName userName email BD roles address phone gender bio interested education skills profileImage"
        }).populate({
            path: 'members',
            select: "firstName lastName userName email BD roles address phone gender bio interested education skills profileImage"
        })
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
        if (communityExist?.image && communityExist.image !== defaultCommunityImage) {
            deleteFile(communityExist.image)
        }

        return { success: true }
    }
}
