import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";


@Schema({ timestamps: true })
export class Subcategory {
    @Prop({ type: String, trim: true, required: true })
    name: string
    
    @Prop({ type: String, trim: true, required: true })
    slug: string

    @Prop({ type: String, required: true })
    image: string

    @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
    categoryId:Types.ObjectId

    @Prop({ type: Types.ObjectId, ref:'User', required: true })
    createdBy:Types.ObjectId
    @Prop({ type: Types.ObjectId, ref:'User', required: true })
    updatedBy:Types.ObjectId
}

export type subcategoryDocument = Subcategory & Document

export const subcategorySchema = SchemaFactory.createForClass(Subcategory)