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
}
