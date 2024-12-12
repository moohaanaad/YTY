import { Injectable } from "@nestjs/common"


@Injectable()
export class MessageService {
    private generateMessage = (item: string) => (
        {
            notFound: `${item} not found`,
            alreadyExist: `${item} already exist`,
            empty: `${item} is empty`
        }
    )
    messages = {
        category: this.generateMessage('category'),
        subcategory: this.generateMessage('subcategory'),
        File: {
            invaledFile: 'invaled file formate',
            imageRequired: 'image is required'
        },
        user:{
            ...this.generateMessage('user'),
            email: 'email already exist',
            phone: 'phone already exist',
            verifiedEmail: 'this account is already verified',
            failToLogin : 'email or password is not correct',
            OTP: {
                alreadyExist:'you already have an OTP plase check your email',
                notMatch: 'your OTP is not match'
            }
        }
    }
}