import { IsMongoId, IsString } from "class-validator";
import { Types } from "mongoose";


export class CreateSubcategoryDto {
    @IsString()
    name:string

    @IsMongoId()
    categoryId:string

    @IsMongoId()
    createdBy:string
}