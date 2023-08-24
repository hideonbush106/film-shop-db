import { Injectable } from '@nestjs/common';
// import { CreateFilmDto } from './dto/create-film.dto';
// import { UpdateFilmDto } from './dto/update-film.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FilmDto } from './dto/film.dto';
import { Prisma } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class FilmsService {
  constructor(private prisma: PrismaService) {}

  async create(createFilmDto: FilmDto) {
    try {
      const film = await this.prisma.film.create({
        data: {
          title: createFilmDto.title,
          director: createFilmDto.director,
          nation: createFilmDto.nation,
          genre: createFilmDto.genre,
          description: createFilmDto.description,
          releaseDate: createFilmDto.releaseDate,
          rating: createFilmDto.rating,
          trailerURL: createFilmDto.trailerURL,
          posterURL: createFilmDto.posterURL,
        },
      });
      return film;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        //Film already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('Film already exists');
        }
      }
    }
  }

  async findAll() {
    const films = await this.prisma.film.findMany({
      include: {
        User: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    return films;
  }

  async findOne(id: string) {
    const films = await this.prisma.film.findUnique({
      where: {
        id: id,
      },
      include: {
        User: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return films;
  }

  async update(id: string, updateFilmDto: FilmDto) {
    try {
      const film = await this.prisma.film.update({
        where: {
          id: id,
        },
        data: {
          title: updateFilmDto.title,
          director: updateFilmDto.director,
          nation: updateFilmDto.nation,
          genre: updateFilmDto.genre,
          description: updateFilmDto.description,
          releaseDate: updateFilmDto.releaseDate,
          rating: updateFilmDto.rating,
          trailerURL: updateFilmDto.trailerURL,
          posterURL: updateFilmDto.posterURL,
        },
      });
      return film;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        //Film already exists
        if (error.code === 'P2002') {
          throw new ForbiddenException('Film already exists');
        }
      }
    }
  }

  remove(id: string) {
    const film = this.prisma.film.delete({
      where: {
        id: id,
      },
    });
    return film;
  }
}
