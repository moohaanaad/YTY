import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { ConfirmEmail, Gender, UserRole, UserStatus } from "src/utils/enums/user.enums";

@Schema({ timestamps: true })
export class User {

    @Prop({ type: String, required: true })
    firstName: string;

    @Prop({ type: String, required: true })
    lastName: string;

    @Prop({ type: String, unique: true, required: true })
    email: string;

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

    @Prop({ type: Date, required: true })
    BD: Date;

    @Prop({ type: String, enum: Object.values(Gender), required: true })
    gender: string;

    @Prop({ type: String, unique: true })
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

    @Prop({tpye: Date })
    expireDateOTP:Date

    @Prop({ type: String })
    education: string

    @Prop({ type: String })
    skill: string

    @Prop({ type: [String] })
    interested: string[]

    readonly _id:Types.ObjectId

}
export type userDocument = User & Document

export const userSchema = SchemaFactory.createForClass(User);


