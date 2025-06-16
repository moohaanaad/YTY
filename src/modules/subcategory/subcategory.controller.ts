import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common"
import { AuthGuard } from "src/guard/authentication.guard"
import { SubcategoryService } from "./subcategory.service"
import {  } from "@nestjs/platform-express"
import { CreateSubcategoryDto } from "./dto/createSubcategory.dto"
import { CategoryParamDto } from "../category/dto/categoryParam.dto"
import { SubcategoryParamDto } from "./dto/subcategoryParam.dto"
import { RolesGuard } from "src/guard/roles.guard"
import { Roles } from "../authorization/roles.decorator"
import { UserRole } from "src/utils"


@Controller('subcategory')
@UseGuards(AuthGuard , RolesGuard)
export class SubcategoryController {
    constructor(private subcategoryService: SubcategoryService) { }

    //create subcategory
    @Post()
    @Roles(UserRole.ADMIN)
    createSubcategory(@Body() body: CreateSubcategoryDto, @Req() req: any) {
        return this.subcategoryService.createSubcategory(body, req)
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
    @Roles(UserRole.ADMIN)
    updateSubcategory(@Param() param: SubcategoryParamDto, @Body() body: any, @Req() req: any) {
        return this.subcategoryService.updateSubcategory(param, body, req)
    }

    //delete subcategory
    @Delete(':subcategoryId')
    @Roles(UserRole.ADMIN)
    deleteSubcategory(@Param() param: SubcategoryParamDto, @Req() req: any){
        return this.subcategoryService.deleteSubcategory(param, req)
    }
}
