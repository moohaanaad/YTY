import { IsNotEmpty, IsString, IsStrongPassword, ValidateIf } from "class-validator"


export class changePasswordDto {

    @IsNotEmpty()
    @IsString()
    oldPassword: string

    @IsString()
    @IsStrongPassword()
    newPassword: string

    @IsNotEmpty()
    @IsString()
    @ValidateIf(o => o.repassword ===o.newPassword)
    repassword: string
}