import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import slugify from 'slugify';
import { deleteFile } from 'src/common';
import { CategoryRepository, SubcategoryRepository } from 'src/models';
import { MessageService } from 'src/utils';

@Injectable()
export class CategoryService {
    constructor(
        private categoryRepo: CategoryRepository,
        private messageService: MessageService,
        private subcategoryRepo: SubcategoryRepository
    ) { }

    //create category
    createCategory = async (body: any, file: Express.Multer.File) => {
        const { name } = body

        //chack Existence
        if (!file) {
            throw new BadRequestException(this.messageService.messages.File.imageRequired)
        }
        const categoryExist = await this.categoryRepo.findOne({ name })
        if (categoryExist) {
            deleteFile(file.path)
            throw new ConflictException(this.messageService.messages.category.alreadyExist)
        }

        //save data
        body.slug = slugify(name)
        body.image = file.path
        const createdCategory = await this.categoryRepo.create(body)

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
    gateSpecificCategory = async (param: any) => {
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
    updateCategory = async (param: any, body: any, file: Express.Multer.File) => {
        const { name } = body
        const { categoryId } = param
        //check existence 
        const categoryExist = await this.categoryRepo.findById(categoryId)
        if (!categoryExist) {
            if (file) {
                deleteFile(file.path)
            }
            throw new NotFoundException(this.messageService.messages.category.notFound)
        }
        if (name && categoryExist.name != name) {
            const nameExist = await this.categoryRepo.findOne({ name })
            if (nameExist) {
                if (file) {
                    deleteFile(file.path)
                }
                throw new ConflictException(this.messageService.messages.category.alreadyExist)
            }
            categoryExist.name = name
            categoryExist.slug = slugify(name)
        }
        if (file) {
            deleteFile(categoryExist.image)
            categoryExist.image = file.path
        }
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
            const imagesPath = SubcategoryExist.map((sub) => sub.image)

            //delete
            await this.subcategoryRepo.deleteMany({ _id: { $in: subcategoriesIds } })
            for (let i = 0; i < imagesPath.length; i++) {
                deleteFile(imagesPath[i]);

            }
        }
        deleteFile(categoryExist.image)
        return { success: true }
    }

}
