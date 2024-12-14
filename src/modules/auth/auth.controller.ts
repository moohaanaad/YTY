import { Body, Controller, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guard/authentication.guard';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    //signup
    @Post()
    signup(@Body() body: SignupDto) {
        return this.authService.signup(body)
    }

    //verify
    @Get('verify/:token')
    verify(@Param('token') token: string) {
        return this.authService.verify(token)
    }

    //signin
    @Put('signin')
    signin(@Body() body: SigninDto) {
        return this.authService.signin(body)
    }

    //forget password
    @Put('forget-password')
    forgetPassword(@Body('email') email: string){
        return this.authService.forgetPassword(email)
    }

    //forget password
    @Put('verify-reset')
    verifyReset(@Body() body: string){
        return this.authService.verifyReset(body)
    }

    //reset password
    @Put('reset-password')
    resetPassword(@Body() body: ResetPasswordDto){
        return this.authService.resetPassword(body)
    }

    //logout
    @Put('logout')
    @UseGuards(AuthGuard)
    logout(@Req() req:any){
        return this.authService.logout(req)
    }
}
