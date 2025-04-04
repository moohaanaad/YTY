import { Prop, Schema } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { OpportunityReactEnum } from "src/utils/enums/opportunity.enum";


@Schema({ _id: false })
export class Reaction {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: String, enum: Object.values(OpportunityReactEnum), required: true })
  react: string;
}