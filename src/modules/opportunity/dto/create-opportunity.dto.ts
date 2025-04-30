import { Type } from 'class-transformer';
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
  @Type(() => Date)
  deadline: Date;

  @IsString()
  company: string

  @IsString()
  responsibilities: string

  @IsString()
  requirements: string

  @IsString()
  duration: string

  @IsString()
  link: string
}
