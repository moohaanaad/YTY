import { Opportunity, OpportunityDocument } from "./opportunity.schema";
import { AbstractRepositry } from "../abstract.repository";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";


export class opportunityRepository extends AbstractRepositry<Opportunity> {
    constructor(
        @InjectModel(Opportunity.name) private opportunityModel:Model<OpportunityDocument>
    ){
        super(opportunityModel);
    }
       
    

}