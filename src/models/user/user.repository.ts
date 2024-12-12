import { InjectModel } from "@nestjs/mongoose";
import { AbstractRepositry } from "../abstract.repository";
import { User, userDocument } from "./user.schema";
import { Model } from "mongoose";


export class UserRepository extends AbstractRepositry<userDocument> {
    constructor(
        @InjectModel(User.name) private userModel: Model<userDocument>
    ) {
        super(userModel)
    }
    
}