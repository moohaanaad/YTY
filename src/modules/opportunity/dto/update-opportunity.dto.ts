import { Type } from 'class-transformer';
import { IsOptional, IsString, IsDate } from 'class-validator';

export class UpdateOpportunityDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  deadline: Date;
}
