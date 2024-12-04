import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import slugify from 'slugify';
import { deleteFile } from 'src/common';
import { CategoryRepository, SubcategoryRepository } from 'src/models';
import { MessageService } from 'src/utils';

@Injectable()
export class SubcategoryService {
    constructor(
        private subcategoryRepo: SubcategoryRepository,
        private categoryRepo: CategoryRepository,
        private messageService: MessageService
    ) { }

    //create subcategory
    createSubcategory = async (body: any, file: Express.Multer.File) => {
        const { name, categoryId, createdBy } = body

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
        // todo get createdBy from token

        //save data
        const createdsubcategory = await this.subcategoryRepo.create(body)

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
    updateSubcategory = async (param: any, body: any, file: Express.Multer.File) => {
        //distract
        const { subcategoryId } = param
        const { name } = body

        //check existence
        const subcategoryExist = await this.subcategoryRepo.findById(subcategoryId)//todo make createdBy who can update his subcategory
        if (!subcategoryExist) {
            if (file) {
                deleteFile(file.path)
            }
            throw new NotFoundException(this.messageService.messages.category.notFound)
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
        //save update
        await subcategoryExist.save()

        //response
        return { success: true, data: subcategoryExist }
    }

    //delete subcategory
    deleteSubcategory = async (param: any) => {
        const { subcategoryId } = param

        //check existence
        const subcategoryExist = await this.subcategoryRepo.findByIdAndDelete(subcategoryId)//todo make createdBy who can delete his subcategory
        if (!subcategoryExist) {
            throw new NotFoundException(this.messageService.messages.subcategory.notFound)
        }
        //delete image
        deleteFile(subcategoryExist.image)

        //response
        return { success: true }

    }
}
