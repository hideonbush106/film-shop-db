import { Genre } from '@prisma/client';
import {
  IsDateString,
  IsDecimal,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FilmDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  director: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nation: string[];

  @ApiProperty({ enum: Genre })
  @IsString()
  @IsNotEmpty()
  genre: Genre[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  releaseDate: Date;

  @ApiProperty()
  @IsDecimal()
  @IsNotEmpty()
  rating: number;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  trailerURL: string;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  posterURL: string;
}
