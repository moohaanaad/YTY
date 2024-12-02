import { Type } from "class-transformer";
import { IsInt, IsMongoId, IsString, MaxLength, MinLength } from "class-validator";


export class CategoryDto {
    
    @IsString()
    @MinLength(2)
    @MaxLength(20)
    name: string

    @IsMongoId()
    createdBy: string

}