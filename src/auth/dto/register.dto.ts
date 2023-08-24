import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
