import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { dS, fileValidation, fileValidationTypes } from "src/common"
import { AuthGuard } from "src/guard/authentication.guard"
import { CategoryService } from "./category.service"
import { CreateCategoryDto } from "./dto/category.dto"
import { CategoryParamDto } from "./dto/categoryParam.dto"
import { UpdateCategoryDto } from "./dto/updateCategory.dto"
import { RolesGuard } from "src/guard/roles.guard"
import { Roles } from "../authorization/roles.decorator"
import { UserRole } from "src/utils"


@Controller('category')
@UseGuards(AuthGuard,RolesGuard)
export class CategoryController {
    constructor(private categoryService: CategoryService) { }
    
    //create category
    @Post()
    @Roles(UserRole.ADMIN)
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
    @Roles(UserRole.ADMIN)
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
    @Roles(UserRole.ADMIN)
    deleteCategory(@Param() param: CategoryParamDto) {
        return this.categoryService.deleteCategory(param)
    }
}
