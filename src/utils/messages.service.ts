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
        community: {
            ...this.generateMessage('community'),
            join: {
                ...this.generateMessage('join request'),
                communityFull: 'this community is full',
                communityRejected: 'You have been rejected from this community and cannot reapply',
                alreadyJoined: "you are already joined",
                alreadyRequested: "you are already requested",
                joinSuccessfully: 'Joined the community successfully',
                leaveSuccessfully: 'leaved the community successfully',
                requestSent: 'Join request sent. Awaiting admin approval',
                joinCanceled: 'Join request canceled successfully',
                joinNotFound: 'you are not joined in this community'
            }
        },
        opportunity: {
            ...this.generateMessage("opportunity")
        },
        File: {
            invaledFile: 'invaled file formate',
            imageRequired: 'image is required'
        },
        user: {
            ...this.generateMessage('user'),
            email: 'email already exist',
            emailExpired: 'you already send an email plase check your email',
            emailSendSuccessFully: 'email was sent successfully',
            phone: 'phone already exist',
            verifiedEmail: 'this account is already verified',
            userName: this.generateMessage('userName'),
            failToLogin: 'email or password is not correct',
            OTP: {
                alreadyExist: 'you already have an OTP plase check your email',
                notMatch: 'your OTP is not match',
                expireOTP: 'your OTP is expired',
                notFoundOTP: 'your OTP is not found please generate an OTP'
            }

        }
    }
}