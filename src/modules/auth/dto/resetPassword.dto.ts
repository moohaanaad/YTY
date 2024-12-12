import { IsEmail, IsInt, IsNotEmpty, IsString, IsStrongPassword, Min, ValidateIf } from "class-validator";


export class ResetPasswordDto {

    @IsInt()
    @Min(4)
    OTP: number

    @IsEmail()
    email: string

    @IsString()
    @IsStrongPassword()
    password: string

    @IsNotEmpty()
    @IsString()
    @ValidateIf(o => o.repassword ===o.password)
    repassword: string
}
