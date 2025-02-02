import { InjectModel } from "@nestjs/mongoose";
import { AbstractRepositry } from "../abstract.repository";
import { Community, communityDocument } from "./community.schema";
import { Model } from "mongoose";


export class CommunityRepository extends AbstractRepositry<Community> {
    constructor(
        @InjectModel(Community.name) private communityModel:Model<communityDocument>
    ){
        super(communityModel)
    }
}