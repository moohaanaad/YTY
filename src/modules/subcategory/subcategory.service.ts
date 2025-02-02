import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import { deleteFile } from 'src/common';
import { CategoryRepository, CommunityRepository, SubcategoryRepository } from 'src/models';
import { MessageService } from 'src/utils';

@Injectable()
export class SubcategoryService {
    constructor(
        private subcategoryRepo: SubcategoryRepository,
        private categoryRepo: CategoryRepository,
        private messageService: MessageService,
        private communityRepo: CommunityRepository
    ) { }

    //create subcategory
    createSubcategory = async (body: any, req: any, file: Express.Multer.File) => {
        const { user } = req
        const { name, categoryId } = body

        //check existence
        if (!file) {
            throw new BadRequestException(this.messageService.messages.File.imageRequired)
        }
        const subcategoryExist = await this.subcategoryRepo.findOne({ name })
        if (subcategoryExist) {
            deleteFile(file.path)
            throw new ConflictException(this.messageService.messages.subcategory.alreadyExist)
        }
        const categoryExist = await this.categoryRepo.findById(categoryId)
        if (!categoryExist) {
            deleteFile(file.path)
            throw new NotFoundException(this.messageService.messages.category.notFound)
        }
        //prepare data

        body.slug = slugify(name)
        body.image = file.path
        body.createdBy = user._id
        body.updatedBy = user._id

        //save data
        const createdsubcategory = await this.subcategoryRepo.create(body)
        if (!createdsubcategory) {
            throw new InternalServerErrorException()
        }

        //response 
        return { success: true, data: createdsubcategory }
    }

    //get all subcategories
    getAllSubcategpries = async (param: any) => {
        const { categoryId } = param

        //check existence
        const categoryExist = await this.categoryRepo.findById(categoryId)
        if (!categoryExist) {
            throw new NotFoundException(this.messageService.messages.category.notFound)
        }

        const subcategoryExist = await this.subcategoryRepo.find({ categoryId: categoryId })
        if (!subcategoryExist) {
            throw new NotFoundException(this.messageService.messages.subcategory.empty)
        }

        return { success: true, data: subcategoryExist }
    }

    //get specific subcategory
    getSpecificSubcategory = async (param: any) => {
        const { subcategoryId } = param

        //check existence 
        const subcategoryExist = await this.subcategoryRepo.findById(subcategoryId)
        if (!subcategoryExist) {
            throw new NotFoundException(this.messageService.messages.subcategory.notFound)
        }

        //response
        return { success: true, data: subcategoryExist }
    }

    //update subcategory
    updateSubcategory = async (param: any, body: any, req: any, file: Express.Multer.File) => {
        //distract
        const { user } = req
        const { subcategoryId } = param
        const { name } = body

        //check existence
        const subcategoryExist = await this.subcategoryRepo.findOne({ _id: subcategoryId, createdBy: user._id })//todo make createdBy who can update his subcategory
        if (!subcategoryExist) {
            if (file) {
                deleteFile(file.path)
            }
            throw new NotFoundException(this.messageService.messages.subcategory.notFound)
        }

        //prepare data
        if (name && subcategoryExist.name != name) {
            const nameExist = await this.subcategoryRepo.findOne({ name })
            if (nameExist) {
                if (file) {
                    deleteFile(file.path)
                }
                throw new ConflictException(this.messageService.messages.subcategory.alreadyExist)
            }
            subcategoryExist.name = name
            subcategoryExist.slug = slugify(name)
        }
        if (file) {
            deleteFile(subcategoryExist.image)
            subcategoryExist.image = file.path
        }
        subcategoryExist.updatedBy = user._id
        //save update
        await subcategoryExist.save()

        //response
        return { success: true, data: subcategoryExist }
    }

    //delete subcategory
    deleteSubcategory = async (param: any, req: any) => {
        const { subcategoryId } = param
        const { user } = req

        //check existence
        const subcategoryExist = await this.subcategoryRepo.findOneAndDelete({ _id: subcategoryId, createdBy: user._id })
        if (!subcategoryExist) {
            throw new NotFoundException(this.messageService.messages.subcategory.notFound)
        }

        //prepare data 
        const communityExist = await this.communityRepo.find({ subcategory: subcategoryId })

        //delete communities
        if (communityExist) {

            const communityIds = communityExist.map((com) => com._id)
            const communityImage = communityExist.map((com) => com.image)
            const defaultCommunityImage = 'uploads\\community\\Community-Avatar.jpg' 

            await this.communityRepo.deleteMany({ _id: { $in: communityIds } })

            for (let i = 0; i < communityImage.length; i++) {
                if(communityImage[i] !== defaultCommunityImage) {
                    deleteFile(communityImage[i])
                }
            }

        }

        //delete image
        deleteFile(subcategoryExist.image)

        //response
        return { success: true }

    }
}
