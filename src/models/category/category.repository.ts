import { InjectModel } from "@nestjs/mongoose";
import { AbstractRepositry } from "../abstract.repository";
import { Category, categoryDocument } from "./category.schema";
import { Model } from "mongoose";


export class CategoryRepository extends AbstractRepositry<Category> {
    constructor(
        @InjectModel(Category.name) private categoryModel: Model<categoryDocument>
    ) {
        super(categoryModel)
    }
}