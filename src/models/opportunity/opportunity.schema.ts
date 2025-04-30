import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User, userDocument } from 'src/models'; // Assuming User model exists
import mongoose from 'mongoose';
import { Reaction } from './subdocument/reaction.schema';

export type OpportunityDocument = Opportunity & Document;

@Schema({ timestamps: true })
export class Opportunity {
  @Prop({ required: true })
  title: string;

  @Prop({ type: String, trim: true })
  slug: string

  @Prop({ type: String })
  description: string;

  @Prop({ type: String })
  company: string;

  @Prop({ type: String })
  responsibilities: string;
  
  @Prop({ type: String })
  requirements: string;
  
  @Prop({ type: String })
  duration: string;
  
  @Prop({ type: String })
  link: string;

  @Prop({ type: Date, required: true })
  deadline: Date;

  @Prop({ type: String })
  image: string

  @Prop({ type: [Reaction] })
  react: Reaction[]

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  createdBy: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  updatedBy: User;
}

export const OpportunitySchema = SchemaFactory.createForClass(Opportunity);
