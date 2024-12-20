import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { customRandom, random } from "nanoid";
import { MessageService } from "./messages.service";

@Injectable()
export class OTPService {
    constructor(private messsageService: MessageService) { }

    // Generate OTP
    generateOTP() {
        return Math.floor(Math.random() * 9000 + 1000)
    }
    verifyOTP(input: number, generatedOTP: number, expireDateOTP: Date) {
        if(!generatedOTP){
            throw new NotFoundException(this.messsageService.messages.user.OTP.notFoundOTP)
        }
        if (expireDateOTP < new Date(Date.now())) {
            throw new ConflictException(this.messsageService.messages.user.OTP.expireOTP)
        }
        if(input != generatedOTP){
            throw new ConflictException( this.messsageService.messages.user.OTP.notMatch)
        }
        return true
    }

}