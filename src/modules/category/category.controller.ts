import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { dS, fileValidation, fileValidationTypes } from 'src/common';
import { CreateCategoryDto } from './dto/category.dto';
import { CategoryParamDto } from './dto/categoryParam.dto';
import { AuthGuard } from 'src/guard/authentication.guard';
import { UpdateCategoryDto } from './dto/updateCategory.dto';

@Controller('category')
@UseGuards(AuthGuard)
export class CategoryController {
    constructor(private categoryService: CategoryService) { }

    //create category
    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: dS('uploads/category'),
            fileFilter: fileValidation(fileValidationTypes.image)
        }))
    careateCategory(@Body() body: CreateCategoryDto, @Req() req: any, @UploadedFile() file: Express.Multer.File) {
        return this.categoryService.createCategory(body, req, file)
    }

    //get all categories
    @Get()
    getCategories() {
        return this.categoryService.getCategories()
    }

    //get specific category
    @Get(':categoryId')
    gatSpecificCategory(@Param() param: CategoryParamDto) {
        return this.categoryService.gatSpecificCategory(param)
    }

    //update category
    @Put(':categoryId')
    @UseInterceptors(
        FileInterceptor('image', {
            storage: dS('uploads/category'),
            fileFilter: fileValidation(fileValidationTypes.image)
        }))
    updateCategory(@Param() param: CategoryParamDto, @Body() body: UpdateCategoryDto, @Req() req: any, @UploadedFile() file: Express.Multer.File) {
        return this.categoryService.updateCategory(param, body, req, file)
    }

    //delete category
    @Delete(':categoryId')
    deleteCategory(@Param() param: CategoryParamDto) {
        return this.categoryService.deleteCategory(param)
    }
}
