import { Transform, Type } from "class-transformer";
import { IsEnum, IsMongoId, IsNumber, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator"
import { Types } from "mongoose"
import { CommunityStatus } from "src/utils/enums/community.enum";

class LocationDto {

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    state: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    city: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    street: string;
}

// class DateDto {
//     @Type(() => Date)
//     startDate: Date

//     @Type(() => Date)
//     endDate: Date

//     @Type(() => Date)
//     schedule: string[]

//     @Type(() => Date)
//     startAt: Date

//     @Type(() => Date)
//     finishAt: Date
// }

class DateDto {
    @Type(() => Date)
    @Transform(({ value }) => new Date(value))
    startDate: Date;
  
    @Type(() => Date)
    @Transform(({ value }) => new Date(value))
    endDate: Date;
  
    @Type(() => Date)
    @Transform(({ value }) => JSON.parse(value)) // Parse JSON string to array
    schedule: string[];
  
    @Type(() => Date)
    @Transform(({ value }) => new Date(value))
    startAt: Date;
  
    @Type(() => Date)
    @Transform(({ value }) => new Date(value))
    finishAt: Date;
  }


export class CreateCommunityDto {

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    name: string

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    type: string

    @IsString()
    @MinLength(2)
    @MaxLength(500)
    desc: string

    @IsMongoId()
    category: Types.ObjectId

    @IsMongoId()
    subcategory: Types.ObjectId

    @IsNumber()
    @Transform(({ value }) => Number(value))
    limitOfUsers: number

    @IsOptional()
    @IsString()
    roles: string

    // @ValidateNested()
    @Type(() => LocationDto)
    // @Transform(({ value }) => JSON.parse(value))
    location: LocationDto

    @IsEnum(CommunityStatus)
    status: string

    // @ValidateNested()
    // @Transform(({ value }) => JSON.parse(value))
    @Type(() => DateDto)
    date: DateDto
    
}