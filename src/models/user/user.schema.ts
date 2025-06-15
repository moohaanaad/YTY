import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Mongoose, Types } from "mongoose";
import { ConfirmEmail, ConfirmVolunteerRequist, Gender, UserRole, UserStatus } from "src/utils/enums/user.enum";
import { joinCommunities } from "./subdocumnet/joinCommunity";
import { IDcardImages } from "./subdocumnet/IDcard";

@Schema({ timestamps: true })
export class User {

    @Prop({ type: String, required: true })
    firstName: string;

    @Prop({ type: String, required: true })
    lastName: string;

    @Prop({ type: String, unique: true, required: true })
    email: string;

    @Prop({ tpye: Date })
    expireDateEmail: Date

    @Prop({ type: String, required: true })
    password: string;

    @Prop({ type: Object, required: true })
    address: {
        state: string;
        city: string;
        street: string;
    }

    @Prop({ type: String, unique: true, required: true })
    phone: string;

    @Prop({ type: Date })
    BD: Date;

    @Prop({ type: String, enum: Object.values(Gender), required: true })
    gender: string;

    @Prop({ type: String })
    userName: string;

    @Prop({ type: String })
    profileImage: string;

    @Prop({ type: String })
    bio: string

    @Prop({ type: String, enum: Object.values(UserRole), default: UserRole.USER })
    roles: string;

    @Prop({ type: String, enum: Object.values(UserStatus), default: UserStatus.OFFLINE })
    status: string

    @Prop({ type: String, enum: Object.values(ConfirmEmail), default: ConfirmEmail.PENDING })
    confirmEmail: string

    @Prop({ type: Number })
    OTP: number

    @Prop({ tpye: Date })
    expireDateOTP: Date
    
    @Prop({ type: [String] })
    interested: string[]
    
    @Prop({ type: [Object] })
    communities: joinCommunities[]
    
    //volunteer
    @Prop({ type: String })
    education: string

    @Prop({ type: [String] })
    skills: string[]

    @Prop({ type: Object })
    IDImages:IDcardImages

    @Prop({ type: String, enum:Object.values(ConfirmVolunteerRequist)})
    volunteerReqStatus:string

    readonly _id: Types.ObjectId
    readonly createdAt: Date

}
export type userDocument = User & Document

export const userSchema = SchemaFactory.createForClass(User);


