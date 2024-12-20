import { IsMongoId, IsString } from "class-validator";


export class CreateSubcategoryDto {
    @IsString()
    name:string

    @IsMongoId()
    categoryId:string
}