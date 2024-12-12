import { Injectable } from "@nestjs/common";
import { customRandom, random } from "nanoid";

@Injectable()
export class OTPService {
    constructor() { }

    // Generate OTP
    generateOTP() {
        return Math.floor(Math.random() * 9000 + 1000)
    }
    verifyOTP(input:number, generatedOTP: number){
        return input === generatedOTP
    }
    
}