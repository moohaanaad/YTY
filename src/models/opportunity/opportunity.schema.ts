import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User, userDocument } from 'src/models'; // Assuming User model exists
import mongoose from 'mongoose';

export type OpportunityDocument = Opportunity & Document;

@Schema({ timestamps: true })
export class Opportunity {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Date, required: true })
  deadline: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;
}

export const OpportunitySchema = SchemaFactory.createForClass(Opportunity);
