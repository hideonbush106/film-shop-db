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
import { User as UserEntity, Role as RoleEnum } from '@prisma/client';
import { Role } from 'src/auth/decorator/role.decorator';
// import { AddToFavorites } from './dto/add-to-favorites.dto';

@ApiTags('Films')
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  findAll() {
    return this.filmsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('my-films')
  findMyFilms(@User() user: UserEntity) {
    return this.filmsService.findUserFilms(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filmsService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN)
  @Post('create')
  create(@Body() createFilmDto: FilmDto) {
    return this.filmsService.create(createFilmDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateFilmDto: FilmDto) {
    return this.filmsService.update(id, updateFilmDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('add-to-favorites/:id')
  addToFavorites(@User() userDto: UserEntity, @Param('id') filmId: string) {
    return this.filmsService.addToFavorites(userDto.id, filmId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Put('remove-from-favorites/:id')
  removeFromFavorites(
    @User() userDto: UserEntity,
    @Param('id') filmId: string,
  ) {
    return this.filmsService.removeFromFavorites(userDto.id, filmId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Role(RoleEnum.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filmsService.remove(id);
  }
}
