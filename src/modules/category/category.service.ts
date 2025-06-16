import {
    BadRequestException, ConflictException, Injectable,
    InternalServerErrorException, NotFoundException
} from '@nestjs/common';
import slugify from 'slugify';
import { deleteFile } from 'src/common';
import { CategoryRepository, CommunityRepository, SubcategoryRepository } from 'src/models';
import { MessageService } from 'src/utils';

@Injectable()
export class CategoryService {
    constructor(
        private categoryRepo: CategoryRepository,
        private messageService: MessageService,
        private subcategoryRepo: SubcategoryRepository,
        private communityRepo: CommunityRepository
    ) { }

    //create category
    createCategory = async (body: any, req: any) => {
        const { user } = req
        const { name } = body

        //chack Existence
        const categoryExist = await this.categoryRepo.findOne({ name })
        if (categoryExist) {
            throw new ConflictException(this.messageService.messages.category.alreadyExist)
        }

        //save data
        body.slug = slugify(name)
        body.createdBy = user._id
        body.updatedBy = user._id
        const createdCategory = await this.categoryRepo.create(body)
        if (!createdCategory) {
            throw new InternalServerErrorException()
        }

        //response
        return { success: true, data: createdCategory }
    }

    //get categories
    getCategories = async () => {

        //check existence
        const categoriesExist = await this.categoryRepo.find()
        if (!categoriesExist) {
            throw new NotFoundException(this.messageService.messages.category.empty)
        }

        //response
        return { success: true, data: categoriesExist }
    }

    //get specific category 
    gatSpecificCategory = async (param: any) => {
        const { categoryId } = param

        //check existence
        const categoryExist = await this.categoryRepo.findById(categoryId)
        if (!categoryExist) {
            throw new NotFoundException(this.messageService.messages.category.notFound)
        }

        //response
        return { success: true, data: categoryExist }
    }

    //update category
    updateCategory = async (param: any, body: any, req: any) => {
        const { user } = req
        const { name, desc } = body
        const { categoryId } = param
        //check existence 
        const categoryExist = await this.categoryRepo.findById(categoryId)
        if (!categoryExist) {
            
            throw new NotFoundException(this.messageService.messages.category.notFound)
        }
        if (name && categoryExist.name != name) {
            const nameExist = await this.categoryRepo.findOne({ name })
            if (nameExist) {
                
                throw new ConflictException(this.messageService.messages.category.alreadyExist)
            }
            categoryExist.name = name
            categoryExist.slug = slugify(name)
        }
        if (desc && desc !== categoryExist.desc) {
            categoryExist.desc = desc
        }
    
        categoryExist.updatedBy = user._id
        await categoryExist.save()
        return { success: true, data: categoryExist }
    }

    //delete category
    deleteCategory = async (param: any) => {
        const { categoryId } = param

        //check existence
        const categoryExist = await this.categoryRepo.findByIdAndDelete(categoryId)
        if (!categoryExist) {
            throw new NotFoundException(this.messageService.messages.category.notFound)
        }
        const SubcategoryExist = await this.subcategoryRepo.find({ categoryId: categoryId })


        if (SubcategoryExist) {

            //prepare data
            const subcategoriesIds = SubcategoryExist.map((sub) => sub._id)
            const communityExist = await this.communityRepo.find({ category: categoryId })

            //prepare communities data
            if (communityExist) {
                const communityIds = communityExist.map((com) => com._id)
                const communityImages = communityExist.map((com) => com.image)
                const defaultCommunityImage = 'uploads\\community\\Community-Avatar.jpg'

                //delete all communities related by subcategory
                await this.communityRepo.deleteMany({ _id: { $in: communityIds } })

                //delete all communities images
                for (let i = 0; i < communityImages.length; i++) {
                    if (communityImages[i] !== defaultCommunityImage) {
                        deleteFile(communityImages[i])
                    }

                }
            }

            //delete
            await this.subcategoryRepo.deleteMany({ _id: { $in: subcategoriesIds } })
            
        }
        return { success: true }
    }

}
