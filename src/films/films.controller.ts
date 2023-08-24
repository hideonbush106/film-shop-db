import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmDto } from './dto/film.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Films')
@UseGuards(JwtAuthGuard)
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  create(@Body() createFilmDto: FilmDto) {
    return this.filmsService.create(createFilmDto);
  }

  @Get()
  findAll() {
    return this.filmsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filmsService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateFilmDto: FilmDto) {
    return this.filmsService.update(id, updateFilmDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filmsService.remove(id);
  }
}
