import { IsNotEmpty, IsString, IsDate } from 'class-validator';

export class CreateOpportunityDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDate()
  deadline: Date;
}
