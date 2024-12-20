import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { dS, fileValidation, fileValidationTypes } from 'src/common';
import { CreateSubcategoryDto } from './dto/createSubcategory.dto';
import { CategoryParamDto } from '../category/dto/categoryParam.dto';
import { SubcategoryParamDto } from './dto/subcategoryParam.dto';
import { AuthGuard } from 'src/guard/authentication.guard';

@Controller('subcategory')
@UseGuards(AuthGuard)
export class SubcategoryController {
    constructor(private subcategoryService: SubcategoryService) { }

    //create subcategory
    @Post()
    @UseInterceptors(FileInterceptor('image', {
        storage: dS('uploads/subcategory'),
        fileFilter: fileValidation(fileValidationTypes.image)
    }))
    createSubcategory(@Body() body: CreateSubcategoryDto, @Req() req: any, @UploadedFile() file: Express.Multer.File) {
        return this.subcategoryService.createSubcategory(body, req, file)
    }

    //get all subcategories of specific category
    @Get(':categoryId')
    getAllCategories(@Param() param: CategoryParamDto) {
        return this.subcategoryService.getAllSubcategpries(param)
    }

    //get specific subcategory
    @Get('specific/:subcategoryId')
    getSpecificSubcategory(@Param() param: SubcategoryParamDto) {
        return this.subcategoryService.getSpecificSubcategory(param)
    }

    //update subcategory
    @Put(':subcategoryId')
    @UseInterceptors(FileInterceptor('image', {
        storage: dS('uploads/subcategory'),
        fileFilter: fileValidation(fileValidationTypes.image)
    }))
    updateSubcategory(@Param() param: SubcategoryParamDto, @Body() body: any, @Req() req: any, @UploadedFile() file: Express.Multer.File) {
        return this.subcategoryService.updateSubcategory(param, body, req, file)
    }

    //delete subcategory
    @Delete(':subcategoryId')
    deleteSubcategory(@Param() param: SubcategoryParamDto){
        return this.subcategoryService.deleteSubcategory(param)
    }
}
