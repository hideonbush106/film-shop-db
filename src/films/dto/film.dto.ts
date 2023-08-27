import { Genre } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
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
  @IsArray()
  @IsNotEmpty()
  nation: string[];

  @ApiProperty({ enum: Genre })
  @IsArray()
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
  @IsNumber()
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
