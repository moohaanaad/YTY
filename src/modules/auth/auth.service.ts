import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PasswordService } from 'src/common/hashAndComparePassword/password.service';
import { UserRepository } from 'src/models/user/user.repository';
import { MessageService } from 'src/utils';
import { ConfirmEmail, UserStatus } from 'src/utils/enums/user.enums';
import { MailService } from 'src/utils/mail.service';
import { OTPService } from 'src/utils/OTP.service';

@Injectable()
export class AuthService {
    constructor(
        private userRepo: UserRepository,
        private messageService: MessageService,
        private passwordService: PasswordService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private mailService: MailService,
        private OTPService: OTPService
    ) { }

    //signup
    signup = async (body: any) => {
        const { email, password, phone } = body

        //check existence
        const userExist = await this.userRepo.findOne({ $or: [{ phone }, { email }] })
        if (userExist?.email) {
            throw new ConflictException(this.messageService.messages.user.email)
        }
        if (userExist?.phone) {
            throw new ConflictException(this.messageService.messages.user.phone)
        }

        //prepare data
        const hashedPassword = await this.passwordService.hashPassword(password)
        body.password = hashedPassword

        //save data
        const createdUser = await this.userRepo.create(body)

        //generate token 
        const token = await this.jwtService.sign({ email }, { secret: this.configService.get<string>('SECRET_VER_TOKEN') })

        //send email
        await this.mailService.sendEmail({
            to: email,
            subject: "confirm email",
            html: `<h1>click on <a href="http://localhost:3000/auth/verify/${token}">link</a></h1>`
        })

        //response 
        return { success: true, data: createdUser }
    }

    //verify
    verify = async (token: string) => {
        const { email } = await this.jwtService.verify(token, { secret: this.configService.get<string>('SECRET_VER_TOKEN') })
        const userExist = await this.userRepo.findOne({ email })

        //check existence
        if (userExist.confirmEmail == ConfirmEmail.VERIFIED) {
            throw new ConflictException(this.messageService.messages.user.verifiedEmail)
        }

        // prepare data 
        userExist.confirmEmail = ConfirmEmail.VERIFIED

        //save changence
        await userExist.save()

        //response
        return { success: true }
    }

    //singin
    signin = async (body: any) => {
        const { email, password } = body

        //check existence 
        const userExist = await this.userRepo.findOne({ email, confirmEmail: ConfirmEmail.VERIFIED })
        if (!userExist) {
            throw new NotFoundException(this.messageService.messages.user.failToLogin)
        }
        const comparedPassword = await this.passwordService.compare(password, userExist.password)
        if (!comparedPassword) {
            throw new NotFoundException(this.messageService.messages.user.failToLogin)
        }

        //prepare data 
        const token = await this.jwtService.sign({ _id: userExist._id }, { secret: this.configService.get<string>('SECRET_LOGIN_TOKEN') })
        userExist.status = UserStatus.ONLINE

        //save changence
        await userExist.save()

        //response
        return { success: true, token }
    }

    //forget password
    forgetPassword = async (email: string) => {
        
        //check existence
        const userExist = await this.userRepo.findOne({ email })
        if (!userExist) {
            throw new NotFoundException(this.messageService.messages.user.notFound)
        }


        if (userExist?.OTP && userExist?.expireDateOTP > new Date(Date.now())) {
            throw new ConflictException(this.messageService.messages.user.OTP.alreadyExist)
        }
        
        //genetrate OTP
        userExist.OTP = this.OTPService.generateOTP()
        userExist.expireDateOTP = new Date(Date.now() + 15 * 60 * 1000)

        //save data
        await userExist.save()

        //send email
        this.mailService.sendEmail({
            to: email,
            subject: 'OTP',
            html: `<h1> your OTP is ${userExist.OTP}</h1>`
        })

        //response
        return { success: true }

    }

    //verify reset password
    verifyReset = async (body: any) => {
        const { OTP, email } = body

        //check existence
        const userExist = await this.userRepo.findOne({ email })
        if (!userExist) {
            throw new NotFoundException(this.messageService.messages.user.notFound)
        }

        
        this.OTPService.verifyOTP(OTP, userExist?.OTP, userExist?.expireDateOTP)

        //response
        return { success: true }
    }

    //reset password
    resetPassword = async (body: any) => {
        const { email, password, OTP } = body

        //check existence 
        const userExist = await this.userRepo.findOne({ email })
        if (!userExist) {
            throw new NotFoundException(this.messageService.messages.user.notFound)
        }

        this.OTPService.verifyOTP(OTP, userExist?.OTP, userExist?.expireDateOTP)

        //prepare data
        const hashedPassword = await this.passwordService.hashPassword(password)
        userExist.password = hashedPassword
        userExist.OTP = undefined
        userExist.expireDateOTP = undefined

        //save data
        await userExist.save()

        //response
        return { success: true, data: userExist }

    }

    //logout
    logout = async (req: any) => {
        const { user } = req

        //preparec data
        user.status = UserStatus.OFFLINE

        //save changence
        await user.save()

        //response
        return { success: true, data: user.status }
    }
}
