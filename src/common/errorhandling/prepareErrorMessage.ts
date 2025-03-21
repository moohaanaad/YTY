
export const errorMessages = (error:any) => {

    const messages = []
            for (let i = 0; i < error.response.message.length; i++) {
                if(error.response.message[i].constraints){

                    messages[i] = error.response.message[i].constraints;
                }
                if(error.response.message[i]?.children[0]?.constraints){
                    
                    messages[i] = error.response.message[i].children[0].constraints;
                }
            }
            return messages
}