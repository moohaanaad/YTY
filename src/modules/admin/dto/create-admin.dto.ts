// dto/create-admin.dto.ts
import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsObject, IsString, IsStrongPassword, Length, MaxLength, MinLength, ValidateIf } from 'class-validator';

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

export class CreateAdminDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  firstName: string

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  lastName: string

  @IsEmail()
  email: string;

  @IsString()
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

  @IsNotEmpty()
  @IsString()
  @ValidateIf(o => o.confirmPassword === o.password)
  confirmPassword: string;

}

