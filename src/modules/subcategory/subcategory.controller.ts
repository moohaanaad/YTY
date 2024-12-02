import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { dS, fileValidation, fileValidationTypes } from 'src/common';
import { CreateSubcategoryDto } from './dto/createSubcategory.dto';

@Controller('subcategory')
export class SubcategoryController {
    constructor(private subcategoryService: SubcategoryService) { }

    @Post()
    @UseInterceptors(FileInterceptor('image',{
            storage: dS('uploads/subcategory'),
            fileFilter:fileValidation(fileValidationTypes.image)
        }))
    createSubcategory(@Body() body: CreateSubcategoryDto, @UploadedFile() file: Express.Multer.File) {
        return this.subcategoryService.createSubcategory(body,file)
    }
}
