import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsString } from "class-validator";

class IDImagesDto {
    
    @IsNotEmpty({ message: 'Front ID card image is required' })
  frontIdCardImage: string;

  @IsNotEmpty({ message: 'Back ID card image is required' })
  backIdCardImage: string;

}


export class BecomeVolunteerDto {

    @IsString()
    education:string 

    
    @IsString({ each: true})
    skills:string[] 

    @Type(() => IDImagesDto)
    IDImages: IDImagesDto
}