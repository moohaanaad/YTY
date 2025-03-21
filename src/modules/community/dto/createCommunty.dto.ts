import { Transform, Type } from "class-transformer";
import { IsArray, IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from "class-validator"
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

class DateDto {
    @IsNotEmpty()
    @Type(() => Date)
    startDate: Date;

    @IsNotEmpty()
    @Type(() => Date)
    endDate: Date;

    @IsArray()
    @IsString({ each: true }) // Ensures each item in the array is a string
    schedule: string[];

    @IsNotEmpty()
    @Type(() => Date)
    startAt: Date;

    @IsNotEmpty()
    @Type(() => Date)
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

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => LocationDto)
    location: LocationDto;

    @IsEnum(CommunityStatus)
    status: string

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => DateDto)
    date: DateDto;
    
}