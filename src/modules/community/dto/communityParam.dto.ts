import { IsMongoId } from "class-validator";
import { Types } from "mongoose";

export class CommunityParamDto {
    @IsMongoId()
    communityId: Types.ObjectId
}