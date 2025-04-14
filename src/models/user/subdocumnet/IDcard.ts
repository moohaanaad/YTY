import { Prop } from "@nestjs/mongoose";


//volunteer IDcard images
export class IDcardImages {

    @Prop({ type: String })
    frontIdCardImage:string

    @Prop({ type: String })
    backIdCardImage:string

}