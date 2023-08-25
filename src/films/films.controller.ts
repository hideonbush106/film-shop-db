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
import { RoleGuard } from 'src/auth/guard/role.guard';
import { User } from 'src/users/decorator/user.decorator';
import { User as UserEntity } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('Films')
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  findAll() {
    return this.filmsService.findAll();
  }

  @Get('my-films')
  findMyFilms(@User() user: UserEntity) {
    return this.filmsService.findUserFilms(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filmsService.findOne(id);
  }

  @Post('create')
  create(@Body() createFilmDto: FilmDto) {
    return this.filmsService.create(createFilmDto);
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
