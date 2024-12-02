import { InjectModel } from "@nestjs/mongoose";
import { AbstractRepositry } from "../abstract.repository";
import { Subcategory, subcategoryDocument } from "./subcategory.schema";
import { Model } from "mongoose";


export class SubcategoryRepository extends AbstractRepositry<Subcategory> {
    constructor(
        @InjectModel(Subcategory.name) private subcategoruModel: Model<subcategoryDocument>
    ) {
        super(subcategoruModel)
    }
}