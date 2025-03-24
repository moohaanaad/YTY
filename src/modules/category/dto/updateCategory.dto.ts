<<<<<<< HEAD
import { PartialType } from "@nestjs/mapped-types";
import { CreateCategoryDto } from "./category.dto";


export class UpdateCategoryDto extends PartialType(CreateCategoryDto) { }
=======
import { IntersectionType } from "@nestjs/mapped-types";
import { CreateCategoryDto } from "./category.dto";


export class UpdateCategoryDto extends IntersectionType(CreateCategoryDto) { }
>>>>>>> 4e64151 (f)
