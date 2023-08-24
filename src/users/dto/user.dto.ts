import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
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

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  role: Role;
}
