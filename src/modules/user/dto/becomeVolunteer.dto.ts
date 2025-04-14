import { Type } from "class-transformer";
import { IsArray, IsString } from "class-validator";

class IDImagesDto {

    @IsString()
    frontIdCardImage:string

    @IsString()
    backIdCardImage:string

}


export class BecomeVolunteerDto {

    @IsString()
    education:string 

    @IsArray()
    @IsString({ each: true})
    skills:string []

    @Type(() => IDImagesDto)
    IDImages: IDImagesDto
}