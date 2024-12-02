import { Type } from "@nestjs/common";
import { IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class ParamDto {
    
    @IsMongoId()
    categoryId: Types.ObjectId
}