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
        }
    }
}