import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { joinCommunity } from "src/utils/enums/user.enum";


@Schema()
export class joinCommunities {

    @Prop({ type: Types.ObjectId, ref: "Community" })
    community: string

    @Prop({ type: String, enum: Object.values(joinCommunity), default:joinCommunity.PENDING})
    status: string
}