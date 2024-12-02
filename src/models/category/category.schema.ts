import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


@Schema({ timestamps: true })
export class Category {
    @Prop({ type: String, trim: true, unique: true, required: true })
    name: string

    @Prop({ type: String, trim: true, unique: true, required: true })
    slug: string
    
    @Prop({ type: String, required: true })
    image: string

    @Prop({ type: Types.ObjectId, required: true })//todo ref:'User'
    createdBy: Types.ObjectId
}

export type categoryDocument = Category & Document
export const categorySchema = SchemaFactory.createForClass(Category)