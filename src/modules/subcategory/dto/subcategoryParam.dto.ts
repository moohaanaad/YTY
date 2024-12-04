import { IsMongoId } from "class-validator";
import { Types } from "mongoose";


export class SubcategoryParamDto {

    @IsMongoId()
    subcategoryId: Types.ObjectId
    
}