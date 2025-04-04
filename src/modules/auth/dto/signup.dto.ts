import { Type } from "class-transformer";
import { IsDate, IsEmail, IsObject, IsString, IsStrongPassword, Length, MaxLength, MinLength } from "class-validator";


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

export class SignupDto {
    @IsString()
    @MinLength(3)
    @MaxLength(20)
    firstName: string

    @IsString()
    @MinLength(3)
    @MaxLength(20)
    lastName: string

    @IsEmail()
    email: string

    @IsStrongPassword()
    password: string

    @IsObject()
    @Type(() => AddressDto)
    address: AddressDto;

    @IsString()
    gender: string

    @IsString()
    @Length(11)
    phone: string

}