import { Body, Controller, Delete, Get, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { dS, fileValidation, fileValidationTypes } from 'src/common';
import { CategoryDto } from './dto/category.dto';
import { CategoryParamDto } from './dto/categoryParam.dto';

@Controller('category')
export class CategoryController {
    constructor(private categoryService: CategoryService) { }

    //create category
    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: dS('uploads/category'),
            fileFilter: fileValidation(fileValidationTypes.image)
        }))
    careateCategory(@Body() body: CategoryDto, @UploadedFile() file: Express.Multer.File) {
        return this.categoryService.createCategory(body, file)
    }

    //get all categories
    @Get()
    getCategories() {
        return this.categoryService.getCategories()
    }

    //get specific category
    @Get(':categoryId')
    gateSpecificCategory(@Param() param: CategoryParamDto) {
        return this.categoryService.gateSpecificCategory(param)
    }

    //update category
    @Put(':categoryId')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: dS('uploads/category'),
            fileFilter: fileValidation(fileValidationTypes.image)
        }))
    updateCategory(@Param() param: CategoryParamDto, @Body() body: any, @UploadedFile() file: Express.Multer.File) {
        return this.categoryService.updateCategory(param, body, file)
    }

    //delete category
    @Delete(':categoryId')
    deleteCategory(@Param() param: CategoryParamDto) {
        return this.categoryService.deleteCategory(param)
    }
}
