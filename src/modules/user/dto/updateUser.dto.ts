import { Type } from "class-transformer";
import { IsEmail, IsOptional, IsString, Length, MaxLength, MinLength } from "class-validator";


class AddressDto {
    @IsString()
    @MinLength(3)
    @MaxLength(50)
    state: string;

    @IsString()
    @MinLength(3)
    @MaxLength(50)
    city: string;

    @IsString()
    @MinLength(3)
    @MaxLength(50)
    street: string;
}

export class UpdateUserDto {

    @IsOptional()
    @MinLength(3)
    @MaxLength(20)
    firstName: string;

    @IsOptional()
    @MinLength(3)
    @MaxLength(20)
    lastName: string;

    @IsOptional()
    @Type(() => Date)
    BD: Date;

    @IsOptional()
    @Type(() => AddressDto)
    address: AddressDto;

    @IsOptional()
    gender: string;

    @IsOptional()
    @IsEmail()
    email:string

    @IsOptional()
    @Length(11)
    phone: string;

    @IsOptional()
    @IsString()
    bio: string

    @IsOptional()
    @IsString()
    education:string

    @IsOptional()
    @IsString()
    skill:string

    @IsOptional()
    @IsString()
    interested:string

    @IsOptional()
    @IsString()
    userName:string

}