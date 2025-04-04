import { IsEnum, IsNotEmpty } from "class-validator";
import { OpportunityReactEnum } from "src/utils/enums/opportunity.enum";


export class ReactDto {
    
    @IsNotEmpty()
    @IsEnum(OpportunityReactEnum)
    react:string

}