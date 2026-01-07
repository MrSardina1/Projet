import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInternshipDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  duration: string;
}
