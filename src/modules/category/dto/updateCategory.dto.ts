import { IntersectionType } from "@nestjs/mapped-types";
import { CreateCategoryDto } from "./category.dto";


export class UpdateCategoryDto extends IntersectionType(CreateCategoryDto) { }