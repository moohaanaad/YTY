import { PartialType } from "@nestjs/mapped-types";
import { CreateCommunityDto } from "./createCommunty.dto";


export class UpdateCommuntyDto extends PartialType(CreateCommunityDto) { }