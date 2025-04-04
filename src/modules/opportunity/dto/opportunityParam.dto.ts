import { IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class OpportunityParamDto {
    @IsMongoId()
    opportunityId: Types.ObjectId
}