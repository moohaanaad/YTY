import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { CommunityStatus } from "src/utils/enums/community.enum";


@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class Community {

    @Prop({ type: String, trim: true, unique: true, required: true })
    name: string

    @Prop({ type: String, trim: true })
    slug: string


    @Prop({ type: String, required: true })
    type: string

    @Prop({ type: String, trim: true, required: true })
    desc: string

    @Prop({ type: String })
    image: string

    @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
    category: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'Subcategory', required: true })
    subcategory: Types.ObjectId

    @Prop({ type: [Types.ObjectId], ref: 'User' })
    members: Types.ObjectId[] //meen gwa

    @Prop({ type: Number, required: true })
    limitOfUsers: number // aksa 3dd ll user

    @Prop({ type: String })
    roles: string // kwanen el community

    @Prop({ type: Object, required: true })
    location: {
        state: string;
        city: string;
        street: string;
    }

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    volunteer: Types.ObjectId // data el volunteer

    @Prop({ type: String, enum: Object.values(CommunityStatus), required: true })
    status: string // publice, private

    @Prop({ type: Object, required: true })
    date: {
        startDate: Date, //htbtdy  youm eh 
        endDate: Date, // htkhls youm eh
        schedule: string[], //days
        startAt: Date,
        finishAt: Date
    }

    @Prop({ type: Types.ObjectId, ref: 'User' })
    createdBy: Types.ObjectId

    @Prop({ type: Types.ObjectId, ref: 'User' })
    updatedBy: Types.ObjectId
}

export type communityDocument = Community & Document

export const communitySchema = SchemaFactory.createForClass(Community)

//count members
communitySchema.virtual('numberOfMembers').get(function () {
    return this.members.length
})

//count lesson's time
// communitySchema.virtual('lessonTime').get(function () {
    
//     return this.date.finishAt.getTime() - this.date.startAt.getTime()
// })

// communitySchema.virtual('lessonTime').get(function () {
//     try {
//         const startAt = new Date(this.date?.startAt);
//         const finishAt = new Date(this.date?.finishAt);

//         if (isNaN(startAt.getTime()) || isNaN(finishAt.getTime())) {
//             return null; // Return null if dates are invalid
//         }

//         return finishAt.getTime() - startAt.getTime();
//     } catch (err) {
//         console.error('Error in lessonTime virtual:', err);
//         return null;
//     }
// });