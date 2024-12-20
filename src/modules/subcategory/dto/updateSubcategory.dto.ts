import { IntersectionType } from "@nestjs/mapped-types";
import { CreateSubcategoryDto } from "./createSubcategory.dto";
import { IsOptional } from "class-validator";


export class UpdateSubcategoryDto extends IntersectionType(CreateSubcategoryDto) {
    @IsOptional()
    categoryId: string;
 }